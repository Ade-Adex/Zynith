import { Search, ShoppingCart, Menu, Globe } from 'lucide-react'
import { NAV_LINKS } from '@/app/data'


export const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <span className="text-lg font-black tracking-tighter uppercase italic">
          Zynith<span className="text-blue-600">.</span>
        </span>
        <div className="hidden md:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
         {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-600 transition"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
          <Search size={14} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="bg-transparent border-none text-[11px] focus:outline-none w-40 font-medium"
          />
        </div>
        <button className="text-slate-600 hover:text-blue-600">
          <ShoppingCart size={18} />
        </button>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition">
          Sign In
        </button>
      </div>
    </div>
  </nav>
)
