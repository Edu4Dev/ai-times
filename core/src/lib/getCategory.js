import postsDataJSON from "@/content/cache/postsDatas.json";

// Função para contar e ordenar as categorias
const getCategoryPostCount = () => {
  const categoryCount = {};

  // Itera sobre todos os posts e conta quantas vezes cada categoria aparece
  postsDataJSON.forEach((post) => {
    post.frontmatter.categories.forEach((category) => {
      if (categoryCount[category]) {
        categoryCount[category] += 1;
      } else {
        categoryCount[category] = 1;
      }
    });
  });

  // Transforma o objeto em um array de categorias com a contagem
  const categoryArray = Object.keys(categoryCount).map((category) => ({
    category,
    count: categoryCount[category],
  }));

  // Ordena o array pela contagem de posts em ordem decrescente
  categoryArray.sort((a, b) => b.count - a.count);

  return categoryArray;
};

// Calcula as categorias mais populares
export const sortedCategories = getCategoryPostCount();

// Pegando a categoria mais popular
export const mostPopularCategory = sortedCategories[0]?.category || "General";
