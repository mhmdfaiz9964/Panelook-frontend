const BRAND_MAP: { key: string; name: string; textColor: string; bgColor: string }[] = [
  { key: 'hp', name: 'HP', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  { key: 'dell', name: 'DELL', textColor: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  { key: 'lenovo', name: 'Lenovo', textColor: 'text-red-600', bgColor: 'bg-red-50' },
  { key: 'thinkpad', name: 'Lenovo', textColor: 'text-red-600', bgColor: 'bg-red-50' },
  { key: 'ideapad', name: 'Lenovo', textColor: 'text-red-600', bgColor: 'bg-red-50' },
  { key: 'asus', name: 'ASUS', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { key: 'zenbook', name: 'ASUS', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { key: 'acer', name: 'Acer', textColor: 'text-green-600', bgColor: 'bg-green-50' },
  { key: 'nitro', name: 'Acer', textColor: 'text-green-600', bgColor: 'bg-green-50' },
  { key: 'msi', name: 'MSI', textColor: 'text-rose-600', bgColor: 'bg-rose-50' },
];

export function getBrandInfo(laptopModel: string): { name: string; textColor: string; bgColor: string } {
  const lower = laptopModel.toLowerCase();
  const match = BRAND_MAP.find((b) => lower.includes(b.key));
  return match || { name: 'Universal', textColor: 'text-slate-600', bgColor: 'bg-slate-100' };
}
