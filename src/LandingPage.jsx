import React, { useState } from 'react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const articles = [
    {
      id: 1,
      category: 'Életmód',
      date: '2026. 04. 26.',
      title: 'Lorem ipsum dolores',
      text: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 2,
      category: 'Életmód',
      date: '2026. 04. 26.',
      title: 'Lorem ipsum dolores',
      text: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      img: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      category: 'Életmód',
      date: '2026. 04. 26.',
      title: 'Lorem ipsum dolores',
      text: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      img: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=400',
    }
  ];

  return (
    <div className="min-h-screen bg-[#EBEBEB] font-serif text-[#333]">
      {/* Arany felső sáv */}
      <div className="h-2 bg-[#B59A47] w-full" />

      {/* Navigáció */}
      <nav className="bg-white px-4 md:px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="text-xl md:text-2xl font-bold border-b-2 border-[#B59A47]">Változó Kor</div>
        
        {/* Mobil Hamburger Ikon */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
          <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-600 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-600"></div>
        </button>

        {/* Desktop Menü */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-[#B59A47]">Főoldal</a>
          <a href="#" className="hover:text-[#B59A47]">Bejegyzések ▼</a>
          <a href="#" className="hover:text-[#B59A47]">Bemutatkozás</a>
          <button className="border border-gray-400 px-4 py-2 rounded text-sm hover:bg-gray-50 transition">
            Írd meg a Te történeted
          </button>
        </div>
      </nav>

      {/* Mobil Menü legördülő (opcionális extra) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 shadow-lg">
          <a href="#" className="block text-sm py-2 border-b border-gray-50">Főoldal</a>
          <a href="#" className="block text-sm py-2 border-b border-gray-50">Bejegyzések</a>
          <a href="#" className="block text-sm py-2">Bemutatkozás</a>
        </div>
      )}

      {/* Header / Hírlevél */}
      <header className="py-8 md:py-12 px-4 text-center bg-white/30">
        <h1 className="text-xl md:text-2xl font-bold mb-2 uppercase tracking-wide">Mögöttünk álló történetek</h1>
        <p className="text-xs md:text-sm text-gray-600 mb-6 italic">Iratkozz fel, hogy ne maradj le semmiről!</p>
        <div className="flex flex-col md:flex-row max-w-sm mx-auto gap-3 md:gap-0 md:border md:border-gray-300 rounded overflow-hidden">
          <input 
            type="email" 
            placeholder="email cím" 
            className="px-4 py-3 md:py-2 border md:border-none border-gray-300 rounded md:rounded-none outline-none text-sm" 
          />
          <button className="bg-[#D9D98A] py-3 md:py-2 px-6 text-sm font-medium rounded md:rounded-none border-b-2 border-black/10 md:border-none shadow-sm md:shadow-none">
            Feliratkozás
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4 md:px-6">
        
        {/* Legfrissebb bejegyzések */}
        <section className="mb-16">
          <h2 className="bg-[#B59A47] text-white inline-block px-4 py-1 text-base md:text-lg font-medium mb-8">
            Legfrissebb bejegyzések
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Első, kiemelt poszt sárga kerettel */}
            <div className="lg:col-span-7">
              <div className="relative p-1.5 md:p-2 border-2 border-[#D9D98A] rounded-sm mb-4">
                <img src={articles[0].img} alt="" className="w-full aspect-[4/3] md:h-[400px] object-cover" />
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{articles[0].category} | {articles[0].date}</p>
              <h3 className="text-xl md:text-2xl font-bold mb-3">{articles[0].title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{articles[0].text}</p>
            </div>

            {/* További posztok listája */}
            <div className="lg:col-span-5 flex flex-col gap-10 md:gap-8">
              {articles.slice(1).map((article, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <img src={article.img} alt="" className="w-full aspect-video md:w-32 md:h-32 object-cover rounded-sm shadow-sm" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{article.category} | {article.date}</p>
                    <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed md:line-clamp-3">{article.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-10 md:mt-8">
            <a href="#" className="text-sm font-bold flex items-center border-b border-[#B59A47] pb-1">
              Összes Bejegyzés <span className="ml-2 text-[#B59A47]">──→</span>
            </a>
          </div>
        </section>

        {/* Videók Szekció */}
        <section className="mb-16">
          <h2 className="bg-[#B59A47] text-white inline-block px-4 py-1 text-base md:text-lg font-medium mb-8">
            Nézd meg videóinkat!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {[1, 2].map((v) => (
              <div key={v}>
                <div className="relative aspect-video mb-4 overflow-hidden shadow-md">
                  <img src={v === 1 ? articles[0].img : articles[1].img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center border border-white">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Életmód | 2026. 04. 26.</p>
                <h3 className="text-lg font-bold">Lorem ipsum dolores</h3>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end mt-8">
            <a href="#" className="text-sm font-bold flex items-center border-b border-[#B59A47] pb-1">
              Összes Videó <span className="ml-2 text-[#B59A47]">──→</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#606060] text-white pt-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold tracking-widest border-b border-[#B59A47] inline-block mb-2">Változó Kor</h2>
            <p className="text-[10px] text-gray-400 uppercase">2026 Minden jog fenntartva</p>
          </div>

          <div className="flex space-x-6 mb-8">
            {/* Facebook */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            {/* Instagram */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            {/* X */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </div>
          
          <a href="#" className="text-[10px] text-gray-400 hover:underline mb-8">Adatkezelési tájékoztató</a>
        </div>
        <div className="h-4 bg-[#B59A47] w-full" />
      </footer>
    </div>
  );
};

export default LandingPage;