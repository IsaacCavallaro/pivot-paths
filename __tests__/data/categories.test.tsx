import { categories, getCategoryById, getPathById } from '@/data/categories';

describe('categories data', () => {
  it('contains unique categories and structurally valid paths', () => {
    const categoryIds = new Set<string>();
    const pathKeys = new Set<string>();

    expect(categories.length).toBeGreaterThan(0);

    categories.forEach((category) => {
      expect(category.id).toBeTruthy();
      expect(category.title.trim().length).toBeGreaterThan(0);
      expect(categoryIds.has(category.id)).toBe(false);
      expect(getCategoryById(category.id)).toBe(category);

      categoryIds.add(category.id);

      expect(category.paths.length).toBeGreaterThan(0);

      category.paths.forEach((path) => {
        const pathKey = `${category.id}/${path.id}`;

        expect(path.id).toBeTruthy();
        expect(path.title.trim().length).toBeGreaterThan(0);
        expect(pathKeys.has(pathKey)).toBe(false);
        expect(getPathById(category.id, path.id)).toBe(path);
        expect(path.days).toHaveLength(path.totalDays);

        pathKeys.add(pathKey);

        path.days.forEach((day, index) => {
          const enabledFeatures = Object.entries(day).filter(
            ([key, value]) => key.startsWith('has') && value === true
          );

          expect(day.day).toBe(index + 1);
          expect(day.title.trim().length).toBeGreaterThan(0);
          expect(
            day.content.trim().length > 0 || enabledFeatures.length > 0
          ).toBe(true);
        });
      });
    });
  });
});
