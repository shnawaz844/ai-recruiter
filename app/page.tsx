"use client";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FeatureBentoGrid } from "./_components/FeatureBentoGrid";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconArrowRight, IconRobot, IconMicrophone, IconChartBar, IconBriefcase } from "@tabler/icons-react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-neutral-950 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20 px-4 md:px-10">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center py-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6600] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6600]"></span>
              </span>
              <span className="text-sm font-medium text-[#ff6600] dark:text-[#ff6600]">New: AI Voice Screening</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8">
              <span className="text-neutral-900 dark:text-white block">Hire Faster with</span>
              <span className="bg-linear-to-r from-[#ff6600] via-[#ff6600] to-[#ff6600] bg-clip-text text-transparent">
                AI-Powered Recruiting
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-xl text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed"
            >
              Automate your screening process with natural voice AI. Sound professional, evaluate skills accurately, and find your perfect hire in minutes, not weeks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold bg-[#ff6600] hover:bg-[#ff6600] text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                  Start Screening Now
                  <IconArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-2xl group-hover:bg-blue-500/30 transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-2xl bg-white dark:bg-neutral-900 aspect-video">
              <Image
                src="/parth-gautam-umesh-gautam.png"
                alt="Parth Gautam"
                fill
                className="cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className="py-14 relative">
          <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 rounded-3xl -z-10 blur-3xl" />
          <div className="max-w-5xl mx-auto bg-neutral-900 dark:bg-neutral-900 rounded-[2.5rem] p-10 md:p-20 text-center text-white overflow-hidden relative border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none" />

            <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">Ready to transform your <br /> hiring process?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold bg-white text-black hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95">
                  Get Started for Free
                </Button>
              </Link>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-neutral-800 py-12 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-[#ff6600] p-1.5 rounded-lg">
              <IconRobot stroke={2} className="text-white h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-neutral-900 dark:text-white leading-none">AI Recruiter</span>
              <span className="text-[10px] font-bold text-[#ff6600] dark:text-[#ff6600] uppercase tracking-widest mt-0.5 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md w-fit">
                Parth gautam Foundation
              </span>
            </div>
          </Link>

          <p className="text-sm">© {new Date().getFullYear()} AI Recruiter Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl px-4 py-3 dark:border-white/10 dark:bg-neutral-950/70 shadow-2xl shadow-black/5">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-[#ff6600] p-1.5 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
            <IconRobot stroke={2} className="text-white h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">AI Recruiter</h1>
            <span className="text-[10px] font-bold text-[#ff6600] dark:text-[#ff6600] uppercase tracking-widest mt-0.5 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md w-fit">
              Parth gautam Foundation
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        {/* <div className="hidden md:flex items-center gap-8 text-sm font-bold text-neutral-600 dark:text-neutral-400">
          <Link href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Features</Link>
          <Link href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Enterprise</Link>
          <Link href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Case Studies</Link>
          <Link href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Pricing</Link>
        </div> */}

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" className="font-bold text-sm">Login</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="rounded-xl px-6 bg-neutral-900 dark:bg-white dark:text-neutral-900 font-bold text-sm shadow-xl shadow-black/20 transition-all hover:scale-105 active:scale-95">
                  Join Beta
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex gap-4 items-center">
              <UserButton />
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-xl border-neutral-200 dark:border-neutral-800 font-bold text-sm">Dashboard</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
