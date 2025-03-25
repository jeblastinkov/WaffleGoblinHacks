import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { CategoryModel } from "@shared/schema";

export default function CategorySection() {
  const { data: categories, isLoading } = useQuery<CategoryModel[]>({
    queryKey: ['/api/categories'],
  });

  const renderCategoryButton = (category: CategoryModel) => (
    <Link key={category.id} href={`/category/${category.id}`}>
      <a className={`pixel-button bg-[${category.color}] px-4 py-3 rounded-lg text-white font-pixel text-xs shadow-md flex flex-col items-center`}>
        <i className={`${category.icon} text-2xl mb-2`}></i>
        {category.name}
      </a>
    </Link>
  );

  return (
    <section className="container mx-auto px-4 py-8 mb-8">
      <h2 className="font-pixel text-xl text-[#3E2844] mb-6">BROWSE BY CATEGORY</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.map(category => renderCategoryButton(category))}
          
          <Link href="/archive">
            <a className="pixel-button bg-blue-400 px-4 py-3 rounded-lg text-white font-pixel text-xs shadow-md flex flex-col items-center">
              <i className="ri-more-line text-2xl mb-2"></i>
              More...
            </a>
          </Link>
        </div>
      )}
    </section>
  );
}
