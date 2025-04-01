import { NextRequest, NextResponse } from 'next/server';

// Auth0 Management API requires a token with proper scopes
// We need to get a token for the Management API with the 'delete:users' scope
async function getManagementApiToken() {
  try {
    // This is a simplified example. In production, you'd want to cache this token
    // as it's valid for 24 hours typically
    console.log('Auth0 issuer base URL:', process.env.AUTH0_ISSUER_BASE_URL);
    console.log('Management Client ID:', process.env.AUTH0_MGMT_CLIENT_ID || 'Using fallback');
    
    const tokenResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Use Management API credentials if available, otherwise fall back to regular credentials
        client_id: process.env.AUTH0_MGMT_CLIENT_ID || process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET || process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
        grant_type: 'client_credentials'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Failed to obtain Management API token:', errorData);
      throw new Error(`Failed to obtain Management API token: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const data = await tokenResponse.json();
    console.log('Successfully obtained Management API token');
    return data.access_token;
  } catch (error) {
    console.error('Error getting management token:', error);
    throw error;
  }
}

// API route to delete a user's account
export async function DELETE(req: NextRequest) {
  try {
    console.log('Delete account API endpoint called');
    
    // 1. Get the user ID from the request
    // For security, you'd normally verify this is the authenticated user
    // Normally we'd get this from the session, but for simplicity and to test the Management API
    // we'll allow passing it directly
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    console.log('User ID for deletion:', userId);

    // 2. Get a token for the Auth0 Management API
    console.log('Getting management API token...');
    const managementToken = await getManagementApiToken();
    console.log('Management token obtained');

    // 3. Call the Auth0 Management API to delete the user
    console.log(`Attempting to delete user ${userId}...`);
    const deleteUserUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${encodeURIComponent(userId)}`;
    console.log('Delete URL:', deleteUserUrl);
    
    const deleteUserResponse = await fetch(deleteUserUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${managementToken}`,
        'Content-Type': 'application/json'
      }
    });

    // 4. Check if the deletion was successful
    if (!deleteUserResponse.ok) {
      let errorMsg = `Failed with status: ${deleteUserResponse.status} ${deleteUserResponse.statusText}`;
      try {
        const errorData = await deleteUserResponse.json();
        console.error('Error deleting user:', errorData);
        errorMsg = errorData.message || errorData.error || errorMsg;
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      
      return NextResponse.json(
        { error: `Failed to delete user account: ${errorMsg}` },
        { status: deleteUserResponse.status }
      );
    }

    console.log('User deleted successfully');
    
    // 5. Return success response
    return NextResponse.json(
      { success: true, message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in delete account endpoint:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 