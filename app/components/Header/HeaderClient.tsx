// "use client";

// import { useState } from "react";
// import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
// import Image from "next/image";
// import Link from "next/link";
// import { FolderOpen, PenBox, MapPin, Menu } from "lucide-react";
// import MotionWrapperDelay from "@/components/MotionWrapperDelay";
// import { Button } from "@/components/ui/button";
// import UserMenu from "@/components/UserMenu";
// import UserLoading from "@/components/user-loading";

// interface HeaderClientProps {
//   userData: { profileType: "employer" | "worker" | "pending" | null } | null;
// }

// const HeaderClient = ({ userData }: HeaderClientProps) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const { user, isLoaded } = useUser();
//   const toggleMenu = () => setIsMenuOpen((prev) => !prev);
//   const profileType = userData?.profileType;

//   return (
//     <MotionWrapperDelay
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true, amount: 0.5 }}
//       transition={{ duration: 0.5, delay: 0.5 }}
//       variants={{
//         hidden: { opacity: 0, x: -100 },
//         visible: { opacity: 1, x: 0 },
//       }}
//     >
//       <header className="mx-auto gradient-background2 relative">
//         <nav className="py-10 px-8 flex justify-between items-center relative z-20">
//           <Link href="/">
//             <Image
//               src="/domestic.jpg"
//               alt="Domestic Worker App Logo"
//               width={80}
//               height={120}
//               className="h-20 w-auto object-contain"
//             />
//           </Link>
//           <div className="hidden md:flex items-center gap-4">
//             <SignedIn>
//               <Link href="/employers">
//                 <Button
//                   variant="outline"
//                   className="flex items-center gap-2 group"
//                 >
//                   <span className="text-white group-hover:text-indigo-500 transition-colors duration-200">
//                     <FolderOpen size={18} />
//                   </span>
//                   <span className="hidden md:inline text-white group-hover:text-indigo-500">
//                     All Employers
//                   </span>
//                 </Button>
//               </Link>
//               <Link href="/workers">
//                 <Button
//                   variant="outline"
//                   className="flex items-center gap-2 group"
//                 >
//                   <span className="text-white group-hover:text-indigo-500 transition-colors duration-200">
//                     <MapPin size={18} />
//                   </span>
//                   <span className="hidden md:inline text-white group-hover:text-indigo-500">
//                     All Workers
//                   </span>
//                 </Button>
//               </Link>
//               {isLoaded && user && profileType && profileType !== "pending" ? (
//                 <Link href={`/view-profile/${user.id}`}>
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-2 group"
//                   >
//                     <span className="text-white group-hover:text-indigo-500 transition-colors duration-200">
//                       <PenBox size={18} />
//                     </span>
//                     <span className="hidden md:inline text-white group-hover:text-indigo-500">
//                       View Profile
//                     </span>
//                   </Button>
//                 </Link>
//               ) : null}
//               {isLoaded && user && profileType === "pending" ? (
//                 <Link href="/profile">
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-2 group"
//                   >
//                     <span className="text-white group-hover:text-white transition-colors duration-200">
//                       <PenBox size={18} />
//                     </span>
//                     <span className="hidden md:inline text-white group-hover:text-white">
//                       Create Profile
//                     </span>
//                   </Button>
//                 </Link>
//               ) : isLoaded && user && profileType ? (
//                 <Link href="/profile">
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-2 group"
//                   >
//                     <span className="text-white group-hover:text-white transition-colors duration-200">
//                       <PenBox size={18} />
//                     </span>
//                     <span className="hidden md:inline text-white group-hover:text-white">
//                       Edit Profile
//                     </span>
//                   </Button>
//                 </Link>
//               ) : null}
//             </SignedIn>
//             <SignedOut>
//               <SignInButton forceRedirectUrl="/">
//                 <Button variant="outline">Login</Button>
//               </SignInButton>
//             </SignedOut>
//             <SignedIn>
//               <UserMenu />
//             </SignedIn>
//           </div>
//           <div className="md:hidden flex items-center gap-4">
//             <SignedOut>
//               <SignInButton forceRedirectUrl="/profile">
//                 <Button variant="outline">Login</Button>
//               </SignInButton>
//             </SignedOut>
//             <SignedIn>
//               <UserMenu />
//             </SignedIn>
//             <button
//               onClick={toggleMenu}
//               className="text-white focus:outline-none"
//             >
//               <Menu size={24} />
//             </button>
//           </div>
//         </nav>
//         {isMenuOpen && (
//           <div className="md:hidden bg-black text-white px-4 py-6 absolute top-full left-0 w-full z-50">
//             <SignedIn>
//               <Link href="/employers" onClick={toggleMenu}>
//                 <Button variant="outline" className="w-full text-left mb-4">
//                   All Employers
//                 </Button>
//               </Link>
//               <Link href="/workers" onClick={toggleMenu}>
//                 <Button variant="outline" className="w-full text-left mb-4">
//                   All Workers
//                 </Button>
//               </Link>
//               {isLoaded && user && profileType && profileType !== "pending" ? (
//                 <Link href={`/view-profile/${user.id}`} onClick={toggleMenu}>
//                   <Button variant="outline" className="w-full text-left mb-4">
//                     View Profile
//                   </Button>
//                 </Link>
//               ) : null}
//               {isLoaded && user && profileType === "pending" ? (
//                 <Link href="/profile" onClick={toggleMenu}>
//                   <Button variant="outline" className="w-full text-left">
//                     Create Profile
//                   </Button>
//                 </Link>
//               ) : isLoaded && user && profileType ? (
//                 <Link href="/profile" onClick={toggleMenu}>
//                   <Button variant="outline" className="w-full text-left">
//                     Edit Profile
//                   </Button>
//                 </Link>
//               ) : null}
//             </SignedIn>
//             <SignedOut>
//               <SignInButton forceRedirectUrl="/profile">
//                 <Button
//                   variant="outline"
//                   className="w-full text-left"
//                   onClick={toggleMenu}
//                 >
//                   Login
//                 </Button>
//               </SignInButton>
//             </SignedOut>
//           </div>
//         )}
//         <UserLoading />
//       </header>
//     </MotionWrapperDelay>
//   );
// };

// export default HeaderClient;

"use client";

import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FolderOpen, PenBox, MapPin, Menu } from "lucide-react";
import MotionWrapperDelay from "@/components/MotionWrapperDelay";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import UserLoading from "@/components/user-loading";

interface HeaderClientProps {
  userData: { profileType: "employer" | "worker" | "pending" | null } | null;
}

const HeaderClient = ({ userData }: HeaderClientProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const profileType = userData?.profileType;

  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      <header className="mx-auto gradient-background2 relative">
        <nav className="py-10 px-8 flex justify-between items-center relative z-20">
          <Link href="/">
            <Image
              src="/domestic.jpg"
              alt="Domestic Worker App Logo"
              width={80}
              height={120}
              className="h-12 w-auto object-contain sm:h-20"
            />
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Link href="/employers">
                <Button
                  variant="band"
                  className="flex items-center gap-2 group"
                >
                  <span className="text-white group-hover:text-indigo-500 transition-colors duration-200">
                    <FolderOpen size={18} />
                  </span>
                  <span className="hidden md:inline text-white group-hover:text-indigo-500">
                    All Employers
                  </span>
                </Button>
              </Link>
              <Link href="/workers">
                <Button
                  variant="band"
                  className="flex items-center gap-2 group"
                >
                  <span className="text-white group-hover:text-indigo-500 transition-colors duration-200">
                    <MapPin size={18} />
                  </span>
                  <span className="hidden md:inline text-white group-hover:text-indigo-500">
                    All Workers
                  </span>
                </Button>
              </Link>
              {isLoaded && user && profileType !== "pending" ? (
                <Link href={`/view-profile/${user.id}`}>
                  <Button
                    variant="work1"
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-white group-hover:text-indigo-500 transition-colors duration-200">
                      <PenBox size={18} />
                    </span>
                    <span className="hidden md:inline text-white group-hover:text-indigo-500">
                      View Profile
                    </span>
                  </Button>
                </Link>
              ) : null}
              {isLoaded && user && profileType !== null ? (
                <Link href="/profile">
                  <Button
                    variant="work1"
                    className="flex items-center gap-2 group"
                  >
                    <span className="text-white group-hover:text-white transition-colors duration-200">
                      <PenBox size={18} />
                    </span>
                    <span className="hidden md:inline text-white group-hover:text-white">
                      {profileType === "pending"
                        ? "Create Profile"
                        : "Edit Profile"}
                    </span>
                  </Button>
                </Link>
              ) : null}
            </SignedIn>
            <SignedOut>
              <SignInButton forceRedirectUrl="/">
                <Button variant="outline">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserMenu />
            </SignedIn>
          </div>
          <div className="md:hidden flex items-center gap-4">
            <SignedOut>
              <SignInButton forceRedirectUrl="/profile">
                <Button variant="outline">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserMenu />
            </SignedIn>
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
        {isMenuOpen && (
          <div className="md:hidden bg-black text-white px-4 py-6 absolute top-full left-0 w-full z-50">
            <SignedIn>
              <Link href="/employers" onClick={toggleMenu}>
                <Button variant="work" className="w-full text-left mb-4">
                  All Employers
                </Button>
              </Link>
              <Link href="/workers" onClick={toggleMenu}>
                <Button variant="work" className="w-full text-left mb-4">
                  All Workers
                </Button>
              </Link>
              {isLoaded && user && profileType !== "pending" ? (
                <Link href={`/view-profile/${user.id}`} onClick={toggleMenu}>
                  <Button variant="work2" className="w-full text-left mb-4">
                    View Profile
                  </Button>
                </Link>
              ) : null}
              {isLoaded && user && profileType !== null ? (
                <Link href="/profile" onClick={toggleMenu}>
                  <Button variant="work2" className="w-full text-left">
                    {profileType === "pending"
                      ? "Create Profile"
                      : "Edit Profile"}
                  </Button>
                </Link>
              ) : null}
            </SignedIn>
            <SignedOut>
              <SignInButton forceRedirectUrl="/profile">
                <Button
                  variant="outline"
                  className="w-full text-left"
                  onClick={toggleMenu}
                >
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        )}
        <UserLoading />
      </header>
    </MotionWrapperDelay>
  );
};

export default HeaderClient;
