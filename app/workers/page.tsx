"use client";

import { useState, useEffect } from "react";
import { SignedOut } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PulseLoader } from "react-spinners";
import SearchBar from "@/components/SearchBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAllWorkers } from "@/actions/profiles";

type WorkerProfile = {
  id: number;
  name: string;
  image: string | null;
  address: string;
  strengths: string | null;
  availability: string | null;
  clerkUserId: string;
};

export default function WorkersPage() {
  const [workerProfiles, setWorkerProfiles] = useState<{
    profiles: WorkerProfile[];
    totalPages: number;
    currentPage: number;
  }>({
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
      const workers = await getAllWorkers(query, page);
      setWorkerProfiles(workers);
    } catch (error) {
      console.error("Error fetching workers:", error);
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
        <h1 className="text-3xl font-bold mb-6">Workers</h1>
        <SearchBar
          placeholder="Search workers by name or address..."
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
              }}
            >
              {workerProfiles.profiles.map((worker) => (
                <motion.div
                  key={worker.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={`/view-profile/${worker.clerkUserId}`}>
                    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 mt-10 bg-gradient-to-t from-purple-900 via-indigo-500 to-black">
                      <CardHeader>
                        <CardTitle className="text-center text-2xl">
                          {worker.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {worker.image && (
                          <div className="flex items-center justify-center">
                            <img
                              src={worker.image}
                              alt={worker.name}
                              className="w-28 h-28 rounded-full object-cover mb-2"
                              onError={(e) =>
                                (e.currentTarget.src = "/placeholder.png")
                              }
                            />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Address: {worker.address}
                        </p>
                        {worker.strengths && (
                          <p className="text-sm text-muted-foreground">
                            Strengths: {worker.strengths}
                          </p>
                        )}
                        {worker.availability && (
                          <p className="text-sm text-muted-foreground">
                            Availability: {worker.availability}
                          </p>
                        )}
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
                    { length: workerProfiles.totalPages },
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
                        page === workerProfiles.totalPages
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
