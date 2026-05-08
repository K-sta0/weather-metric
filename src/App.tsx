function App() {
  return (
    // min-h-screen sets full-screen height, bg-base-200 sets a soft gray background color
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Weathermetric</a>
        </div>
      </div>

      {/* Main content container */}
      <main className="p-4 md:p-8 flex justify-center">
        {/* Weather card */}
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Weather in your city</h2>
            <p>details will be added soon </p>

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">Button</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
