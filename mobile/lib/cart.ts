import AsyncStorage from "@react-native-async-storage/async-storage";
export type CartItem={product_id:string;name:string;price:number;currency:string;quantity:number;image:string;store_id:string};
const KEY="yosha_native_cart";
export async function readCart():Promise<CartItem[]>{try{const raw=await AsyncStorage.getItem(KEY);const data=raw?JSON.parse(raw):[];return Array.isArray(data)?data:[]}catch{return[]}}
export async function saveCart(items:CartItem[]){await AsyncStorage.setItem(KEY,JSON.stringify(items))}
export async function addCartItem(item:Omit<CartItem,"quantity">){const items=await readCart();const found=items.find(x=>x.product_id===item.product_id);if(found)found.quantity+=1;else items.push({...item,quantity:1});await saveCart(items);return items}
