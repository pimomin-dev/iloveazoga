export const MOCK_CATEGORIES = [
  { id: 'cat_original', name: 'Original TEA', nameEn: '原茶', order: 1 },
  { id: 'cat_milk_tea', name: 'Classic MILK TEA', nameEn: '奶茶', order: 2 },
  { id: 'cat_fruit', name: 'Double FRUIT', nameEn: '水果茶', order: 3 },
  { id: 'cat_fresh_milk', name: 'Fresh MILK', nameEn: '鮮奶', order: 4 },
  { id: 'cat_cheese', name: 'Cheese MILK FOAM', nameEn: '奶蓋', order: 5 },
];

export const MOCK_TOPPINGS = [
  { id: 'top_pearl', name: '珍珠', price: 10 },
  { id: 'top_golden', name: '黃金珍珠', price: 10 },
  { id: 'top_jelly', name: '焙烏龍茶凍', price: 10 },
];

export const MOCK_PRODUCTS = [
  { id: 'p1', name: '紅茶', nameEn: 'Black Tea', categoryId: 'cat_original', priceM: 25, priceL: 30, isRecommended: false, canBeHot: true },
  { id: 'p2', name: '綠茶', nameEn: 'Green Tea', categoryId: 'cat_original', priceM: 25, priceL: 30, isRecommended: false, canBeHot: false },
  { id: 'p3', name: '春烏龍', nameEn: 'Spring Oolong Tea', categoryId: 'cat_original', priceM: 30, priceL: 35, isRecommended: true, canBeHot: true },
  { id: 'p4', name: '輕烏龍', nameEn: 'Light Roasted Oolong Tea', categoryId: 'cat_original', priceM: 30, priceL: 35, isRecommended: true, canBeHot: true },
  { id: 'p5', name: '奶茶', nameEn: 'Milk Tea', categoryId: 'cat_milk_tea', priceM: 45, priceL: 50, isRecommended: false, canBeHot: true },
  { id: 'p6', name: '珍珠奶茶', nameEn: 'Pearl Milk Tea', categoryId: 'cat_milk_tea', priceM: 55, priceL: 60, isRecommended: false, canBeHot: true },
  { id: 'p7', name: '紅茶鮮奶', nameEn: 'Black Tea Latte', categoryId: 'cat_fresh_milk', priceM: 55, priceL: 65, isRecommended: true, canBeHot: true },
  { id: 'p8', name: '芝士奶蓋春烏龍', nameEn: 'Cheese Milk Foam Spring Oolong', categoryId: 'cat_cheese', priceM: 50, priceL: 60, isRecommended: true, canBeHot: false },
];
