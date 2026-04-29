const Navbar = () => {
  return (
    <header className="bg-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="font-semibold text-lg">Változó Kor</h1>

        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#">Főoldal</a>
          <a href="#">Bejegyzések</a>
          <a href="#">Bemutatkozás</a>
        </nav>

        <button className="hidden md:block border px-4 py-2 rounded-full">
          Írd meg a Te történeted
        </button>

        <div className="md:hidden text-2xl">☰</div>
      </div>
    </header>
  );
};

export default Navbar;
