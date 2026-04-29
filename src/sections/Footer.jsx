const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-10 pt-10">
      <div className="max-w-4xl mx-auto text-center px-4">
        <div className="bg-white text-black p-6 rounded-xl mb-10">
          <p className="mb-4">
            Iratkozz fel, hogy ne maradj le semmiről!
          </p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <input className="border rounded-full px-4 py-2" />
            <button className="bg-primary px-4 py-2 rounded-full">
              Feliratkozás
            </button>
          </div>
        </div>

        <h2 className="text-xl mb-2">Változó Kor</h2>
        <p className="text-sm">2026 Minden jog fenntartva</p>

        <div className="flex justify-center gap-6 my-4 text-xl">
          <span>📘</span>
          <span>📷</span>
          <span>✖</span>
        </div>

        <p className="text-xs pb-6">Adatkezelési tájékoztató</p>
      </div>
    </footer>
  );
};

export default Footer;