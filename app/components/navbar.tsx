"use client"
 
 import { useState, useEffect } from "react"
 import Link from "next/link"
 import { usePathname, useRouter } from "next/navigation"
 import { 
   LogOut, Menu, User, Camera, ChevronDown, 
   Home, Feather, Star, Store, MapPin, 
   Users, Palette, HelpCircle, X
 } from "lucide-react"
 import { cn } from "@/lib/utils"
 
 import { Logo } from "@/components/ui/logo"
 import { Button } from "@/components/ui/button"
 import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuGroup,
   DropdownMenuLabel,
   DropdownMenuSub,
   DropdownMenuSubTrigger,
   DropdownMenuSubContent,
   DropdownMenuPortal,
 } from "@/components/ui/dropdown-menu"
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
 import { useAuth } from "@/hooks/useAuth"
 import { ThemeToggle } from "@/components/dashboard/theme-toggle"
 
 import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
 } from "@/components/ui/navigation-menu"
 import { ScrollArea } from "@/components/ui/scroll-area"
 
 export function Navbar() {
   const [isOpen, setIsOpen] = useState(false)
   const { user, isAuthenticated, isLoading, isPhotographer, isClient, logout } = useAuth()
   const pathname = usePathname()
   const [scrolled, setScrolled] = useState(false)
   const router = useRouter()
   const [servicesOpen, setServicesOpen] = useState(false)
 
   // Add scroll listener for transparent to solid effect
   useEffect(() => {
     const handleScroll = () => {
       const offset = window.scrollY
       if (offset > 50) {
         setScrolled(true)
       } else {
         setScrolled(false)
       }
     }
 
     window.addEventListener('scroll', handleScroll)
     return () => {
       window.removeEventListener('scroll', handleScroll)
     }
   }, [])
 
   // Handle Auth0 logout
   const handleLogout = () => {
     logout()
   }
 
   const isDashboard = pathname?.startsWith("/dashboard")
 
   // Only show the navbar on non-dashboard pages, or on desktop for dashboard
   if (isDashboard && typeof window !== "undefined" && window.innerWidth < 768) {
     return null
   }
 
   return (
     <header 
       className={cn(
         "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
         "bg-background/98 backdrop-blur-md",
         "bg-background/95 backdrop-blur-md",
         scrolled ? "shadow-md" : "border-b border-border/10",
         isDashboard ? "md:flex hidden" : "flex"
       )}
     >
       <div className="container mx-auto px-4 py-4">
         <div className="flex items-center justify-between">
           {/* Logo */}
           <div className="flex items-center gap-2">
             <Logo className="h-10 w-auto" />
             <span className="font-playfair text-lg font-semibold hidden sm:block">
               Travellers <span className="text-primary">Beats</span>
             </span>
           </div>
 
           {/* Desktop Navigation */}
           <NavigationMenu className="hidden md:flex">
             <NavigationMenuList>
               <NavigationMenuItem>
                 <Link href="/" legacyBehavior passHref>
                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     <Home className="mr-2 h-4 w-4" />
                     Home
                   </NavigationMenuLink>
                 </Link>
               </NavigationMenuItem>
 
               <NavigationMenuItem>
                 <NavigationMenuTrigger>
                   <Store className="mr-2 h-4 w-4" />
                   Services
                 </NavigationMenuTrigger>
                 <NavigationMenuContent>
                   <div className="w-[400px] p-4 md:w-[500px] lg:w-[600px]">
                     <div className="grid grid-cols-2 gap-4">
                       <Link href="/services/luts" legacyBehavior passHref>
                         <NavigationMenuLink 
                           className="flex flex-col gap-2 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                           onClick={() => setIsOpen(false)}
                         >
                           <div className="flex items-center gap-2">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                               <Palette className="h-5 w-5 text-primary" />
                             </div>
                             <div>
                               <div className="text-sm font-medium">LUTs & Presets</div>
                               <div className="text-xs text-muted-foreground">Professional color grading for your footage</div>
                             </div>
                           </div>
                         </NavigationMenuLink>
                       </Link>
 
                       <Link href="/services/rentals" legacyBehavior passHref>
                         <NavigationMenuLink 
                           className="flex flex-col gap-2 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                           onClick={() => setIsOpen(false)}
                         >
                           <div className="flex items-center gap-2">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                               <Camera className="h-5 w-5 text-primary" />
                             </div>
                             <div>
                               <div className="text-sm font-medium">Equipment Rentals</div>
                               <div className="text-xs text-muted-foreground">Rent top-quality drone equipment</div>
                             </div>
                           </div>
                         </NavigationMenuLink>
                       </Link>
 
                       <Link href="/services/find-photographers" legacyBehavior passHref>
                         <NavigationMenuLink 
                           className="flex flex-col gap-2 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                           onClick={(e) => {
                             e.preventDefault()
                             setIsOpen(false)
                             if (isAuthenticated) {
                               // If already authenticated
                               if (isClient) {
                                 // If already a client, go to client dashboard
                                 router.push('/dashboard/client')
                               } else if (isPhotographer) {
                                 // If photographer trying to access client features,
                                 // direct to role-specific signin page
                                 router.push('/signin?role=client&hideOtherRoles=true')
                               }
                             } else {
                               // If not authenticated, go to auth page with client role preselected
                               router.push('/signin?role=client&hideOtherRoles=true')
                             }
                           }}
                         >
                           <div className="flex items-center gap-2">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                               <MapPin className="h-5 w-5 text-primary" />
                             </div>
                             <div>
                               <div className="text-sm font-medium">Find Photographers</div>
                               <div className="text-xs text-muted-foreground">Connect with talented drone photographers</div>
                             </div>
                           </div>
                         </NavigationMenuLink>
                       </Link>
 
                       <Link href="/services/join-photographer" legacyBehavior passHref>
                         <NavigationMenuLink 
                           className="flex flex-col gap-2 rounded-md p-3 hover:bg-accent hover:text-accent-foreground"
                           onClick={(e) => {
                             e.preventDefault()
                             setIsOpen(false)
                             if (isAuthenticated) {
                               // If already authenticated
                               if (isPhotographer) {
                                 // If already a photographer, go to photographer dashboard
                                 router.push('/dashboard/photographer')
                               } else if (isClient) {
                                 // If client trying to access photographer features,
                                 // direct to role-specific signin page
                                 router.push('/signin?role=photographer&hideOtherRoles=true')
                               }
                             } else {
                               // If not authenticated, go to auth page with photographer role preselected
                               router.push('/signin?role=photographer&hideOtherRoles=true')
                             }
                           }}
                         >
                           <div className="flex items-center gap-2">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                               <Users className="h-5 w-5 text-primary" />
                             </div>
                             <div>
                               <div className="text-sm font-medium">Join as Photographer</div>
                               <div className="text-xs text-muted-foreground">Become part of our creative community</div>
                             </div>
                           </div>
                         </NavigationMenuLink>
                       </Link>
                     </div>
                   </div>
                 </NavigationMenuContent>
               </NavigationMenuItem>
 
               <NavigationMenuItem>
                 <Link href="/blog" legacyBehavior passHref>
                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     <Feather className="mr-2 h-4 w-4" />
                     Blog
                   </NavigationMenuLink>
                 </Link>
               </NavigationMenuItem>
 
               <NavigationMenuItem>
                 <Link href="/#aboutus" legacyBehavior passHref>
                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     <HelpCircle className="mr-2 h-4 w-4" />
                     About Us
                   </NavigationMenuLink>
                 </Link>
               </NavigationMenuItem>
             </NavigationMenuList>
           </NavigationMenu>
 
           {/* Authentication Buttons - Desktop */}
           <div className="hidden md:flex items-center gap-4">
             <ThemeToggle />
             {isLoading ? (
               // Loading state
               <div className="h-9 w-9 rounded-full bg-primary/10 animate-pulse"></div>
             ) : isAuthenticated && user ? (
               <UserMenu user={user} isPhotographer={isPhotographer} onLogout={handleLogout} />
             ) : (
               <Button variant="default" asChild size="sm" className="font-medium">
                 <Link href="/signin">Sign In</Link>
               </Button>
             )}
           </div>
 
           {/* Mobile Menu */}
           <div className="flex items-center gap-2 md:hidden">
             <div className={cn(isOpen ? 'hidden' : '')}>
               <ThemeToggle />
             </div>
             <Sheet open={isOpen} onOpenChange={setIsOpen}>
               <SheetTrigger asChild className="md:hidden">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   aria-label="Menu"
                   className="relative w-10 h-10 rounded-full bg-background/20 backdrop-blur-md"
                 >
                   <Menu className="h-5 w-5" />
                 </Button>
               </SheetTrigger>
               <SheetContent 
                 side="right" 
                 className="w-full max-w-xs border-l border-border/30 p-0"
               >
                 <div className="h-full flex flex-col">
                   <div className="border-b border-border/20 py-4 px-6 flex justify-between items-center">
                     <Logo className="h-8 w-auto" />
                     <SheetClose asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                         <X className="h-4 w-4" />
                         <span className="sr-only">Close</span>
                       </Button>
                     </SheetClose>
                   </div>
   
                   <ScrollArea className="flex-grow">
                     <div className="p-6">
                       <nav className="grid gap-6">
                         <Link 
                           href="/" 
                           className="group flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                           onClick={() => setIsOpen(false)}
                         >
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
                             <Home className="h-5 w-5 text-primary" />
                           </div>
                           Home
                         </Link>
 
                         <div className="space-y-3">
                           <button
                             onClick={() => setServicesOpen(!servicesOpen)}
                             className="group flex w-full items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                           >
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"> 
                               <Store className="h-5 w-5 text-primary" />
                             </div>
                             <span className="flex-1 text-left">Services</span>
                             <ChevronDown 
                               className={cn(
                                 "h-5 w-5 transition-transform duration-200",
                                 servicesOpen ? "rotate-180" : ""
                               )} 
                             />
                           </button>
                           
                           {/* Conditionally render service links */}
                           {servicesOpen && (
                             <div className="grid grid-cols-1 gap-3 pl-13 ml-3 border-l border-border/50">
                               <Link 
                                 href="/services/luts" 
                                 className="flex items-center gap-2 p-2 text-base hover:text-primary"
                                 onClick={() => setIsOpen(false)}
                               >
                                 <Palette className="h-4 w-4" />
                                 LUTs & Presets
                               </Link>
                               <Link 
                                 href="/services/rentals" 
                                 className="flex items-center gap-2 p-2 text-base hover:text-primary"
                                 onClick={() => setIsOpen(false)}
                               >
                                 <Camera className="h-4 w-4" />
                                 Equipment Rentals
                               </Link>
                               <Link 
                                 href="/services/find-photographers" 
                                 className="flex items-center gap-2 p-2 text-base hover:text-primary"
                                 onClick={(e) => {
                                   e.preventDefault()
                                   setIsOpen(false)
                                   if (isAuthenticated) {
                                     // If already authenticated
                                     if (isClient) {
                                       // If already a client, go to client dashboard
                                       router.push('/dashboard/client')
                                     } else if (isPhotographer) {
                                       // If photographer trying to access client features,
                                       // direct to role-specific signin page
                                       router.push('/signin?role=client&hideOtherRoles=true')
                                     }
                                   } else {
                                     // If not authenticated, go to auth page with client role preselected
                                     router.push('/signin?role=client&hideOtherRoles=true')
                                   }
                                 }}
                               >
                                 <MapPin className="h-4 w-4" />
                                 Find Photographers
                               </Link>
                               <Link 
                                 href="/services/join-photographer" 
                                 className="flex items-center gap-2 p-2 text-base hover:text-primary"
                                 onClick={(e) => {
                                   e.preventDefault()
                                   setIsOpen(false)
                                   if (isAuthenticated) {
                                     // If already authenticated
                                     if (isPhotographer) {
                                       // If already a photographer, go to photographer dashboard
                                       router.push('/dashboard/photographer')
                                     } else if (isClient) {
                                       // If client trying to access photographer features,
                                       // direct to role-specific signin page
                                       router.push('/signin?role=photographer&hideOtherRoles=true')
                                     }
                                   } else {
                                     // If not authenticated, go to auth page with photographer role preselected
                                     router.push('/signin?role=photographer&hideOtherRoles=true')
                                   }
                                 }}
                               >
                                 <Users className="h-4 w-4" />
                                 Join as Photographer
                               </Link>
                             </div>
                           )}
                         </div>
 
                         <Link 
                           href="/blog" 
                           className="group flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                           onClick={() => setIsOpen(false)}
                         >
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
                             <Feather className="h-5 w-5 text-primary" />
                           </div>
                           Blog
                         </Link>
 
                         <Link 
                           href="/#aboutus" 
                           className="group flex items-center gap-3 text-lg font-medium transition-colors hover:text-primary"
                           onClick={() => setIsOpen(false)}
                         >
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20">
                             <HelpCircle className="h-5 w-5 text-primary" />
                           </div>
                           About Us
                         </Link>
                       </nav>
                     </div>
                   </ScrollArea>
 
                   <div className="border-t border-border/20 p-6">
                     <div className="flex flex-col gap-4">
                       {isLoading ? (
                         <div className="py-4 text-center animate-pulse">Loading...</div>
                       ) : isAuthenticated && user ? (
                         <>
                           <div className="flex items-center gap-4 py-3 border-t border-border/20">
                             <Avatar className="h-12 w-12 border border-border/20">
                               <AvatarImage src={user.picture || "/placeholder-user.jpg"} alt={user.name || "User"} />
                               <AvatarFallback>
                                 {user.name
                                   ? user.name.split(" ").map((n: string) => n[0]).join("")
                                   : "U"}
                               </AvatarFallback>
                             </Avatar>
                             <div>
                               <p className="font-medium">{user.name || "User"}</p>
                               <p className="text-sm text-muted-foreground">{user.email || "user@example.com"}</p>
                               <div className="flex items-center mt-1">
                                 <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                                   {isPhotographer ? (
                                     <>
                                       <Camera className="h-3 w-3" />
                                       Photographer
                                     </>
                                   ) : (
                                     <>
                                       <User className="h-3 w-3" />
                                       Client
                                     </>
                                   )}
                                 </span>
                               </div>
                             </div>
                           </div>
                           <div className="flex gap-3">
                             <Button asChild className="flex-1" variant="default">
                               <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                 Dashboard
                               </Link>
                             </Button>
                             <Button
                               variant="outline"
                               className="flex-1"
                               onClick={() => {
                                 handleLogout()
                                 setIsOpen(false)
                               }}
                             >
                               <LogOut className="mr-2 h-4 w-4" />
                               Log Out
                             </Button>
                           </div>
                         </>
                       ) : (
                         <div className="space-y-3">
                           <Button variant="default" asChild className="w-full">
                             <Link href="/signin" onClick={() => setIsOpen(false)}>
                               Sign In
                             </Link>
                           </Button>
                           <Button variant="outline" asChild className="w-full">
                             <Link href="/signup" onClick={() => setIsOpen(false)}>
                               Create Account
                             </Link>
                           </Button>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </SheetContent>
             </Sheet>
           </div>
         </div>
       </div>
     </header>
   )
 }
 
 // User menu component for authenticated users
 function UserMenu({
   user,
   isPhotographer,
   onLogout,
 }: {
   user: any;
   isPhotographer: boolean;
   onLogout: () => void
 }) {
   if (!user) return null
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
           <Avatar className="h-9 w-9">
             <AvatarImage src={user.picture || "/placeholder-user.jpg"} alt={user.name || "User"} />
             <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
               {user.name
                 ? user.name.split(" ").map((n: string) => n[0]).join("")
                 : "U"}
             </AvatarFallback>
           </Avatar>
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent className="w-56 font-sans" align="end" forceMount>
         <div className="flex flex-col space-y-1 p-2">
           <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
           <p className="text-xs leading-none text-muted-foreground">{user.email || "user@example.com"}</p>
           <div className="flex items-center mt-1">
             <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
               {isPhotographer ? (
                 <>
                   <Camera className="h-3 w-3" />
                   Photographer
                 </>
               ) : (
                 <>
                   <User className="h-3 w-3" />
                   Client
                 </>
               )}
             </span>
           </div>
         </div>
         <DropdownMenuSeparator />
         <DropdownMenuGroup>
           <DropdownMenuItem asChild className="cursor-pointer">
             <Link href="/dashboard" className="flex items-center w-full">
               <User className="mr-2 h-4 w-4" />
               <span>Dashboard</span>
             </Link>
           </DropdownMenuItem>
           <DropdownMenuItem asChild className="cursor-pointer">
             <Link href="/dashboard/profile" className="flex items-center w-full">
               <User className="mr-2 h-4 w-4" />
               <span>Profile</span>
             </Link>
           </DropdownMenuItem>
         </DropdownMenuGroup>
         <DropdownMenuSeparator />
         <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
           <LogOut className="mr-2 h-4 w-4" />
           <span>Log out</span>
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   )
 }