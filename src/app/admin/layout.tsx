import Link from 'next/link';
import Image from 'next/image';
import { ScanLine, Users, BarChart3, LogOut, Home } from 'lucide-react';
import { signout } from '@/app/actions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: 'Inicio', href: '/admin', icon: <Home size={24} /> },
    { name: 'Escáner', href: '/admin/scanner', icon: <ScanLine size={24} /> },
    { name: 'Clientes', href: '/admin/clients', icon: <Users size={24} /> },
    // Analytics is disabled for now, but ready for future implementation
    // { name: 'Métricas', href: '/admin/analytics', icon: <BarChart3 size={24} /> },
  ];

  return (
    <div className="flex h-screen bg-black overflow-hidden selection:bg-white/20 relative z-10">
      
      {/* Sidebar para PC (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 backdrop-blur-xl bg-white/2 border-r border-white/5 h-full pt-8 pb-6 px-4">
        <div className="flex items-center justify-center mb-12">
          <Image 
            src="/logo-full.png" 
            alt="MAVERICK Logo" 
            width={160} 
            height={60} 
            className="w-40 object-contain"
            priority
          />
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <div className="text-gray-500 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-white/5 mt-auto">
          <form action={signout}>
            <button 
              type="submit" 
              className="flex items-center gap-4 px-4 py-3 w-full text-left rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all group"
            >
              <LogOut size={24} className="group-hover:text-red-400 transition-colors" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 h-full scroll-smooth">
        {/* En Móvil, mostramos un pequeño header central */}
        <div className="md:hidden flex justify-center items-center py-6 backdrop-blur-md bg-black/40 border-b border-white/5 sticky top-0 z-20">
           <Image 
            src="/logo-full.png" 
            alt="MAVERICK Logo" 
            width={120} 
            height={40} 
            className="w-32 object-contain"
            priority
          />
        </div>
        
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Nav para Móviles (Celulares) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 backdrop-blur-2xl bg-black/80 border-t border-white/10 z-50 px-6 flex items-center justify-around">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex flex-col items-center gap-1.5 p-2 text-gray-400 hover:text-white transition-colors"
          >
            {item.icon}
            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
          </Link>
        ))}
        
        <form action={signout}>
          <button 
            type="submit" 
            className="flex flex-col items-center gap-1.5 p-2 text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={24} />
            <span className="text-[10px] font-medium tracking-wide">Salir</span>
          </button>
        </form>
      </nav>

    </div>
  );
}
