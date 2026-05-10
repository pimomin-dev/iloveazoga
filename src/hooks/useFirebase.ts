import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Category, Product, Topping, Order, OrderStatus } from '../types';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_TOPPINGS } from '../data/mockData';

export function useFirebase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qCat = query(collection(db, 'categories'), orderBy('order'));
    const qProd = collection(db, 'products');
    const qTop = collection(db, 'toppings');

    const unsubCat = onSnapshot(qCat, (snap) => {
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    const unsubProd = onSnapshot(qProd, (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    const unsubTop = onSnapshot(qTop, (snap) => {
      setToppings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topping)));
      setLoading(false);
    });

    return () => {
      unsubCat();
      unsubProd();
      unsubTop();
    };
  }, []);

  const placeOrder = async (order: Omit<Order, 'id' | 'timestamp'>) => {
    return addDoc(collection(db, 'orders'), {
      ...order,
      timestamp: serverTimestamp(),
    });
  };

  const seed = async () => {
    const batch = writeBatch(db);
    
    MOCK_CATEGORIES.forEach(cat => {
      const ref = doc(db, 'categories', cat.id);
      batch.set(ref, { name: cat.name, nameEn: cat.nameEn, order: cat.order });
    });

    MOCK_PRODUCTS.forEach(prod => {
      const ref = doc(db, 'products', prod.id);
      batch.set(ref, prod);
    });

    MOCK_TOPPINGS.forEach(top => {
      const ref = doc(db, 'toppings', top.id);
      batch.set(ref, top);
    });

    await batch.commit();
  };

  return { categories, products, toppings, loading, placeOrder, seed };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const ref = doc(db, 'orders', orderId);
    await setDoc(ref, { status }, { merge: true });
  };

  return { orders, loading, updateOrderStatus };
}
