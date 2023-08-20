import { useState, useEffect } from 'react';

const Index = () => {
  const [theme, setTheme] = useState(document.body.dataset.theme);

  console.log(theme);
  // sync the changed theme value to local storage and body data attribute
  useEffect(() => {
    if (theme && theme !== document.body.dataset.theme) {
      window.localStorage.setItem('theme', theme);
      document.body.dataset.theme = theme;
    }
  }, [theme]);

  const selectTheme = e => {
    e.preventDefault();
    const nextTheme = e.currentTarget.dataset.theme;
    setTheme(nextTheme);
  };

  return (
    <>
      <div>
        <button onClick={selectTheme} data-theme="dark">
          dark
        </button>
        <button onClick={selectTheme} data-theme="light">
          light
        </button>
      </div>
    </>
  );
};

export default Index;
