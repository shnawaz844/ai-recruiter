"use client";
import { motion } from "motion/react";
import { FeatureBentoGrid } from "./_components/FeatureBentoGrid";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-linear-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-linear-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-linear-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-7">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl">
          {"🎯 AI Recruiters that Screen, Interview, and Evaluate Candidates in Real Time"
            .split( " " )
            .map( ( word, index ) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.08,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {/* The 🎯 Emoji (Index 0) - Kept original */}
                {index === 0 ? (
                  <span>{word}</span>
                ) :
                  /* AI Recruiters - Primary Blue Gradient */
                  index < 3 ? (
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
                      {word}
                    </span>
                  ) :
                    /* Action Words - Secondary Violet Gradient */
                    [ "Screen,", "Interview,", "Evaluate" ].includes( word ) ? (
                      <span className="bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-purple-300">
                        {word}
                      </span>
                    ) :
                      /* Real Time - Kept your Amber gradient and ⏱️ emoji */
                      word === "Real" || word === "Time" ? (
                        <span className="relative">
                          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-300">
                            {word}
                          </span>
                          {word === "Time" && (
                            <span className="absolute -right-1 -top-1 text-xs">⏱️</span>
                          )}
                        </span>
                      ) :
                        /* All other words - Default Slate */
                        (
                          <span className="text-slate-700 dark:text-slate-300">{word}</span>
                        )}
              </motion.span>
            ) )}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          AI-powered recruitment platform that conducts professional screening calls, evaluates candidates, and generates detailed hiring insights—saving you time while finding the perfect fit for your team.
        </motion.p>
        <Link href={'/dashboard'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-4"
          >

            <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get Started
            </button>

          </motion.div>
        </Link>
    
      </div>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-10 py-2 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className='flex gap-2 items-center'>
          <div className='bg-blue-600 p-2 rounded-full'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-700 dark:text-slate-200">AI Recruitment</h1>
        </div>

        {/* <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">MediVoice AI</h1> */}
      </div>
      {!user ?
        <Link href={'/dashboard'}>
          <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button></Link> :
        <div className="flex gap-5 items-center">
          <UserButton />
          <Link href={'/dashboard'}>
            <Button>Dashboard</Button>
          </Link>
        </div>
      }
    </nav>
  );
};
