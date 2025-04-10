import { PrismaClient } from '@prisma/client'

async function main() {
  console.log('Start seeding test data...')
  
  // Function to create a new Prisma client for each operation
  const createPrismaClient = () => {
    return new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }

  // Clear existing data - each with its own client
  console.log('Clearing existing data...')
  try {
    const galleryPrisma = createPrismaClient()
    await galleryPrisma.galleryItem.deleteMany()
    await galleryPrisma.$disconnect()
    
    const certPrisma = createPrismaClient()
    await certPrisma.certification.deleteMany()
    await certPrisma.$disconnect()
    
    const equipPrisma = createPrismaClient()
    await equipPrisma.equipment.deleteMany()
    await equipPrisma.$disconnect()
    
    const expPrisma = createPrismaClient()
    await expPrisma.experience.deleteMany()
    await expPrisma.$disconnect()
    
    const catPrisma = createPrismaClient()
    await catPrisma.category.deleteMany()
    await catPrisma.$disconnect()
    
    const profilePrisma = createPrismaClient()
    await profilePrisma.profile.deleteMany()
    await profilePrisma.$disconnect()
    
    const userPrisma = createPrismaClient()
    await userPrisma.user.deleteMany()
    await userPrisma.$disconnect()
    
    console.log('Data cleared successfully')
  } catch (error) {
    console.error('Error clearing data:', error)
    return
  }

  try {
    // Create a test user
    const userPrisma = createPrismaClient()
    const user = await userPrisma.user.create({
      data: {
        id: 'test-user-id',
        auth0Id: 'auth0|test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'CLIENT',
      },
    })
    await userPrisma.$disconnect()
    console.log(`Created user: ${user.id}`)

    // Create a test profile
    const profilePrisma = createPrismaClient()
    const profile = await profilePrisma.profile.create({
      data: {
        userId: user.id,
        title: 'Drone Pilot',
        bio: 'Experienced drone pilot specializing in aerial photography',
        location: 'San Francisco, CA',
        website: 'https://example.com',
        businessName: 'Aerial Visions',
        specializations: ['Aerial Photography', 'Real Estate'],
        serviceArea: 'San Francisco Bay Area',
        languages: ['English', 'Spanish'],
      },
    })
    await profilePrisma.$disconnect()
    console.log(`Created profile for user ${user.id}`)

    // Create categories
    const catPrisma = createPrismaClient()
    const categories = await Promise.all([
      catPrisma.category.create({
        data: {
          name: 'Aerial Photography',
          description: 'Beautiful aerial shots from above',
          profileId: profile.id,
        },
      }),
      catPrisma.category.create({
        data: {
          name: 'FPV Racing',
          description: 'High-speed drone racing footage',
          profileId: profile.id,
        },
      }),
    ])
    await catPrisma.$disconnect()
    console.log(`Created ${categories.length} categories`)

    // Create experience
    const expPrisma = createPrismaClient()
    const experience = await expPrisma.experience.create({
      data: {
        title: 'Professional Drone Pilot',
        company: 'Aerial Visions',
        location: 'San Francisco, CA',
        startDate: new Date('2021-01-01'),
        endDate: null,
        description: 'Capturing stunning aerial footage for commercial clients',
        profileId: profile.id,
      },
    })
    await expPrisma.$disconnect()
    console.log(`Created experience entry: ${experience.title}`)

    // Create equipment
    const equipPrisma = createPrismaClient()
    const equipment = await equipPrisma.equipment.create({
      data: {
        name: 'DJI Mavic Air 2',
        type: 'Drone',
        description: '4K camera drone with 34-minute flight time',
        profileId: profile.id,
      },
    })
    await equipPrisma.$disconnect()
    console.log(`Created equipment: ${equipment.name}`)

    // Create certification
    const certPrisma = createPrismaClient()
    const certification = await certPrisma.certification.create({
      data: {
        name: 'FAA Part 107',
        issuingBody: 'Federal Aviation Administration',
        certificationId: 'FAA-107-123456',
        issueDate: new Date('2021-03-15'),
        expiryDate: new Date('2023-03-15'),
        credentialUrl: 'https://example.com/faa-cert',
        fileUrl: 'https://example.com/faa-cert.pdf',
        profileId: profile.id,
      },
    })
    await certPrisma.$disconnect()
    console.log(`Created certification: ${certification.name}`)

    // Create gallery item
    const galleryPrisma = createPrismaClient()
    const galleryItem = await galleryPrisma.galleryItem.create({
      data: {
        title: 'Sunset over Golden Gate Bridge',
        description: 'Captured with DJI Mavic Air 2 at 400ft',
        imageUrl: 'https://example.com/drone-image1.jpg',
        type: 'IMAGE',
        location: 'San Francisco, CA',
        featured: true,
        views: 0,
        profileId: profile.id,
        categoryId: categories[0].id,
      },
    })
    await galleryPrisma.$disconnect()
    console.log(`Created gallery item: ${galleryItem.title}`)

    console.log('Seeding completed successfully!')
    console.log(`Created 1 user, 1 profile, 2 categories, 1 experience, 1 equipment, 1 certification, and 1 gallery item.`)
  } catch (error) {
    console.error('Error seeding test data:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 