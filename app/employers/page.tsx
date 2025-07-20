// "use client";

// import { useState, useEffect } from "react";
// import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
// import {
//   getAllEmployers,
//   getEmployerByClerkId,
//   Employer,
// } from "@/actions/profiles";
// import SearchBar from "@/components/SearchBar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";
// import { PulseLoader } from "react-spinners";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import Link from "next/link";

// interface EmployerProfilesState {
//   profiles: Employer[];
//   totalPages: number;
//   currentPage: number;
// }

// export default function EmployersPage() {
//   const { user, isLoaded } = useUser();
//   const [employerProfiles, setEmployerProfiles] =
//     useState<EmployerProfilesState>({
//       profiles: [],
//       totalPages: 1,
//       currentPage: 1,
//     });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [hasProfile, setHasProfile] = useState(false);

//   useEffect(() => {
//     const checkProfile = async () => {
//       if (user) {
//         const employer = await getEmployerByClerkId(user.id);
//         setHasProfile(!!employer);
//       }
//     };
//     checkProfile();
//   }, [user]);

//   const fetchProfiles = async (query = "", page = 1) => {
//     setLoading(true);
//     try {
//       const employers = await getAllEmployers(query, page);
//       setEmployerProfiles(employers);
//     } catch (error) {
//       console.error("Error fetching employers:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(
//       () => fetchProfiles(searchQuery, page),
//       300
//     );
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery, page]);

//   return (
//     <div className="container mx-auto py-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h1 className="text-3xl font-bold mb-6">Employers</h1>
//         <SearchBar
//           placeholder="Search employers by name or address..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//             setPage(1);
//           }}
//         />
//         <SignedOut>
//           <Link href="/sign-in">
//             <Button variant="outline" className="mb-4">
//               Sign In
//             </Button>
//           </Link>
//         </SignedOut>
//         <SignedIn>
//           {isLoaded && user && hasProfile && (
//             <Link href={`/view-profile/${user.id}`}>
//               <Button variant="outline" className="mb-4">
//                 View My Profile
//               </Button>
//             </Link>
//           )}
//           {!hasProfile && (
//             <Link href="/profile">
//               <Button variant="outline" className="mb-4">
//                 Create Profile
//               </Button>
//             </Link>
//           )}
//         </SignedIn>
//         {loading ? (
//           <div className="flex justify-center items-center min-h-[200px]">
//             <PulseLoader color="#36d7b7" />
//           </div>
//         ) : (
//           <>
//             <motion.div
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//               initial="hidden"
//               animate="visible"
//               variants={{
//                 hidden: { opacity: 0 },
//                 visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
//               }}
//             >
//               {employerProfiles.profiles.map((employer) => (
//                 <motion.div
//                   key={employer.id}
//                   variants={{
//                     hidden: { opacity: 0, y: 20 },
//                     visible: { opacity: 1, y: 0 },
//                   }}
//                   transition={{ duration: 0.4 }}
//                 >
//                   <Link href={`/view-profile/${employer.clerkUserId}`}>
//                     <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
//                       <CardHeader>
//                         <CardTitle>{employer.name}</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         {employer.image && (
//                           <img
//                             src={employer.image}
//                             alt={employer.name}
//                             className="w-16 h-16 rounded-full object-cover mb-2"
//                             onError={(e) =>
//                               (e.currentTarget.src = "/placeholder.png")
//                             }
//                           />
//                         )}
//                         <p className="text-sm text-muted-foreground">
//                           Address: {employer.address}
//                         </p>
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 </motion.div>
//               ))}
//             </motion.div>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5 }}
//               className="mt-12 flex justify-center"
//             >
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious
//                       onClick={() => setPage(page - 1)}
//                       className={
//                         page === 1
//                           ? "pointer-events-none opacity-50"
//                           : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                   {Array.from(
//                     { length: employerProfiles.totalPages },
//                     (_, i) => i + 1
//                   ).map((p) => (
//                     <PaginationItem key={p}>
//                       <PaginationLink
//                         onClick={() => setPage(p)}
//                         className={page === p ? "bg-purple-600 text-white" : ""}
//                       >
//                         {p}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ))}
//                   <PaginationItem>
//                     <PaginationNext
//                       onClick={() => setPage(page + 1)}
//                       className={
//                         page === employerProfiles.totalPages
//                           ? "pointer-events-none opacity-50"
//                           : "cursor-pointer"
//                       }
//                     />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </motion.div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { SignedOut } from "@clerk/nextjs";
import { getAllEmployers, Employer } from "@/actions/profiles";
import SearchBar from "@/components/SearchBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

interface EmployerProfilesState {
  profiles: Employer[];
  totalPages: number;
  currentPage: number;
}

export default function EmployersPage() {
  const [employerProfiles, setEmployerProfiles] =
    useState<EmployerProfilesState>({
      profiles: [],
      totalPages: 1,
      currentPage: 1,
    });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchProfiles = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const employers = await getAllEmployers(query, page);
      setEmployerProfiles(employers);
    } catch (error) {
      console.error("Error fetching employers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(
      () => fetchProfiles(searchQuery, page),
      300
    );
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, page]);

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-6">Employers</h1>
        <SearchBar
          placeholder="Search employers by name or address..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />
        <SignedOut>
          <Link href="/sign-in">
            <Button variant="outline" className="mb-4">
              Sign In
            </Button>
          </Link>
        </SignedOut>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <PulseLoader color="#36d7b7" />
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
            >
              {employerProfiles.profiles.map((employer) => (
                <motion.div
                  key={employer.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={`/view-profile/${employer.clerkUserId}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-t from-purple-900 via-indigo-500 to-black">
                      <CardHeader>
                        <CardTitle className="text-center text-2xl">
                          {employer.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {employer.image && (
                          <div className="flex items-center justify-center">
                            <img
                              src={employer.image}
                              alt={employer.name}
                              className="w-28 h-28 rounded-full object-cover mb-2"
                              onError={(e) =>
                                (e.currentTarget.src = "/placeholder.png")
                              }
                            />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Address: {employer.address}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-12 flex justify-center"
            >
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(page - 1)}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: employerProfiles.totalPages },
                    (_, i) => i + 1
                  ).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        onClick={() => setPage(p)}
                        className={page === p ? "bg-purple-600 text-white" : ""}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(page + 1)}
                      className={
                        page === employerProfiles.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
