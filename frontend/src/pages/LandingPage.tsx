import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fcfaf6] text-[#25235f]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-lg font-semibold tracking-[0.18em] text-[#3a3792]">
                CIVICPULSE
              </p>
              <p className="text-sm text-[#8885b4]">Society issue resolution</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-[#dbd6f4] bg-white px-5 py-2.5 text-sm font-semibold text-[#4c4998] shadow-[0_10px_22px_rgba(89,82,168,0.08)] transition hover:border-[#4b46c8] hover:bg-[#f7f5ff] hover:text-[#2e2b78]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-[#4b46c8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(75,70,200,0.22)] transition hover:bg-[#3b37ab]"
            >
              Signup
            </Link>
          </div>
        </header>

        <section
          id="home"
          className="grid min-h-[calc(100vh-7rem)] items-center gap-14 py-12 lg:grid-cols-[0.92fr_1.08fr]"
        >
          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-sm uppercase tracking-[0.32em] text-[#9e9acc]">
              Welcome to CivicPulse
            </p>
            <h1
              className="text-5xl leading-[0.94] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
            >
              Society
              <br />
              Issues
              <br />
              Resolved
            </h1>
            <p className="mt-7 max-w-md text-base leading-8 text-[#7d7aa8]">
              One place to report, track, and manage community issues with calm,
              structure, and accountability.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4" id="access">
              <Link
                to="/signup"
                className="rounded-full bg-[#4b46c8] px-8 py-3 text-lg font-semibold text-white shadow-[0_16px_32px_rgba(75,70,200,0.28)] transition hover:bg-[#3b37ab]"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-[#d9d5f4] px-8 py-3 text-lg font-semibold text-[#4b46c8] transition hover:border-[#4b46c8]"
              >
                Login
              </Link>
            </div>

            <div className="mt-8 flex gap-3">
              <span className="h-3 w-3 rounded-full bg-[#d5d2ec]" />
              <span className="h-3 w-3 rounded-full bg-[#c0bce4]" />
              <span className="h-3 w-3 rounded-full bg-[#a8a2dc]" />
            </div>
          </div>

          <div
            id="about"
            className="relative flex min-h-[420px] items-center justify-center"
          >
            <div className="absolute left-12 top-16 h-16 w-16 rounded-full bg-[#f4f1ff]" />
            <div className="absolute right-8 top-10 h-7 w-7 rotate-12 rounded-md bg-[#786ff0]" />
            <div className="absolute left-0 bottom-10 h-24 w-24 rounded-[40%] bg-[#7a72f0]" />
            <div className="absolute left-24 top-24 h-40 w-40 rounded-full border-2 border-dashed border-[#d9d6f5]" />
            <div className="absolute right-24 top-24 h-10 w-10 border-r-[10px] border-b-[10px] border-transparent border-l-[18px] border-l-[#ffbf1f]" />

            <div className="relative h-[360px] w-[360px] rounded-full border-[12px] border-[#bfc2ef] bg-[#e9ebff] shadow-[0_20px_40px_rgba(106,103,171,0.15)]">
              <div className="absolute inset-7 rounded-full border-[10px] border-[#cfd2f5]" />
              <div className="absolute inset-16 rounded-full border-[9px] border-[#b0b4e7]" />
              <div className="absolute inset-[7.3rem] rounded-full border-[8px] border-[#cfd2f5]" />
              <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_12px_rgba(198,202,246,0.65)]" />
            </div>

            <div className="absolute bottom-10 right-2 h-44 w-36 rounded-[2rem_2rem_1rem_1rem] bg-[#ffbf1f] shadow-[0_18px_40px_rgba(255,191,31,0.22)]">
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white" />
              <div className="absolute bottom-[-18px] left-1/2 h-10 w-20 -translate-x-1/2 rounded-b-[1rem] bg-[#655ce0]" />
              <div className="absolute -left-6 top-8 h-10 w-1 rotate-[-35deg] rounded bg-[#ffbf1f]" />
              <div className="absolute -right-6 top-8 h-10 w-1 rotate-[35deg] rounded bg-[#ffbf1f]" />
              <div className="absolute left-10 -top-7 h-10 w-1 rounded bg-[#ffbf1f]" />
              <div className="absolute right-10 -top-7 h-10 w-1 rounded bg-[#ffbf1f]" />
            </div>

            <div className="absolute bottom-2 left-12 h-8 w-64 rounded-full bg-[#e7e4f8]" />
          </div>
        </section>
      </div>
    </main>
  )
}

export default LandingPage
