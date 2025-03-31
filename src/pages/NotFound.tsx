
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center p-8 max-w-md">
        <span className="inline-block text-kamp-primary font-semibold mb-4">404 ошибка</span>
        <h1 className="text-4xl font-bold mb-4 text-white">Страница не найдена</h1>
        <p className="text-gray-300 mb-8">
          Извините, страница, которую вы ищете, не существует или была перемещена.
        </p>
        <a 
          href="/" 
          className="kamp-button-primary inline-flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" />
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
