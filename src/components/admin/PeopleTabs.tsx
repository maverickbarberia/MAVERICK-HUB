'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Scissors, UserCheck } from 'lucide-react'

export function PeopleTabs() {
  const pathname = usePathname()
  
  const tabs = [
    { name: 'Clientes', href: '/admin/clients', icon: <Users size={18} /> },
    { name: 'Barberos', href: '/admin/barbers', icon: <Scissors size={18} /> },
    { name: 'Personal', href: '/admin/staff', icon: <UserCheck size={18} /> },
  ]

  return (
    <div className="flex bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 w-full md:w-max mb-6 mt-1">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
              ${isActive 
                ? 'bg-white text-black shadow-lg scale-100' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 scale-[0.98]'
              }
            `}
          >
            {tab.icon}
            <span className="inline">{tab.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
