import { registerClientAction } from '@/app/actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default async function ClientRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams;
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 backdrop-blur-2xl bg-white/3 border border-white/8 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
        
        <Link 
          href="/" 
          className="absolute left-6 top-8 text-gray-400 hover:text-white transition-colors"
          title="Regresar"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center space-y-4 pt-2 flex flex-col items-center">
          <Image 
            src="/logo-icon-light.png" 
            alt="MAVERICK Icon" 
            width={200} 
            height={80}
            className="w-48 h-auto object-contain mb-2 drop-shadow-md"
            priority
          />
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-gray-400 text-sm">Regístrate para empezar a sumar sellos</p>
        </div>

        <form className="space-y-6" action={registerClientAction}>
          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">
                Nombre Completo
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Juan Pérez"
                className="w-full bg-black/40 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600"
              />
            </div>

            <div>
              <label htmlFor="document_number" className="block text-sm font-medium text-gray-300 mb-1">
                Número de Documento
              </label>
              <input
                id="document_number"
                name="document_number"
                type="text"
                required
                placeholder="Ej. 12345678"
                className="w-full bg-black/40 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-1">
                Número de Celular
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="Ej. 3001234567"
                className="w-full bg-black/40 text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {params?.message && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
              {params.message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-bold rounded-xl px-4 py-3.5 hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98]"
          >
            Registrarme
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          ¿Ya estás registrado?{' '}
          <Link href="/login/client" className="text-white hover:underline font-medium">
            Inicia sesión aquí
          </Link>
        </p>

      </div>
    </main>
  )
}
