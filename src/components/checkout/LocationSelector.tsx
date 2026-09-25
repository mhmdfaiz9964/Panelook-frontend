'use client';

import React, { useEffect, useState } from 'react';
import { getApiUrl } from '@/lib/config';
import { MapPin, ChevronDown } from 'lucide-react';

export interface LocationData {
  provinceId: number | '';
  provinceName: string;
  districtId: number | '';
  districtName: string;
  cityId: number | '';
  cityName: string;
  postalCode: string;
}

interface LocationSelectorProps {
  value?: Partial<LocationData>;
  onChange: (data: LocationData) => void;
  required?: boolean;
}

export function LocationSelector({ value, onChange, required = true }: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | ''>(value?.provinceId || '');
  const [selectedDistrict, setSelectedDistrict] = useState<number | ''>(value?.districtId || '');
  const [selectedCity, setSelectedCity] = useState<number | ''>(value?.cityId || '');

  // 1. Fetch Provinces
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(getApiUrl('/locations/provinces'));
        const json = await res.json();
        if (json.success && json.data) {
          setProvinces(json.data);
        } else {
          // Fallback provinces of Sri Lanka
          setProvinces([
            { id: 1, name: 'Western', code: 'WP' },
            { id: 2, name: 'Central', code: 'CP' },
            { id: 3, name: 'Southern', code: 'SP' },
            { id: 4, name: 'North Western', code: 'NWP' },
            { id: 5, name: 'Sabaragamuwa', code: 'SG' },
            { id: 6, name: 'Eastern', code: 'EP' },
            { id: 7, name: 'Uva', code: 'UP' },
            { id: 8, name: 'North Central', code: 'NCP' },
            { id: 9, name: 'Northern', code: 'NP' },
          ]);
        }
      } catch {
        setProvinces([
          { id: 1, name: 'Western', code: 'WP' },
          { id: 2, name: 'Central', code: 'CP' },
          { id: 3, name: 'Southern', code: 'SP' },
          { id: 4, name: 'North Western', code: 'NWP' },
          { id: 5, name: 'Sabaragamuwa', code: 'SG' },
          { id: 6, name: 'Eastern', code: 'EP' },
          { id: 7, name: 'Uva', code: 'UP' },
          { id: 8, name: 'North Central', code: 'NCP' },
          { id: 9, name: 'Northern', code: 'NP' },
        ]);
      }
    })();
  }, []);

  // 2. When Province Changes, fetch Districts
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict('');
      setCities([]);
      setSelectedCity('');
      return;
    }

    (async () => {
      try {
        const res = await fetch(getApiUrl(`/locations/districts?province_id=${selectedProvince}`));
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setDistricts(json.data);
        } else {
          // Fallback districts for Western / others
          if (Number(selectedProvince) === 1) {
            setDistricts([
              { id: 1, name: 'Colombo', province_id: 1 },
              { id: 2, name: 'Gampaha', province_id: 1 },
              { id: 3, name: 'Kalutara', province_id: 1 },
            ]);
          } else if (Number(selectedProvince) === 2) {
            setDistricts([
              { id: 4, name: 'Kandy', province_id: 2 },
              { id: 5, name: 'Matale', province_id: 2 },
              { id: 6, name: 'Nuwara Eliya', province_id: 2 },
            ]);
          } else if (Number(selectedProvince) === 3) {
            setDistricts([
              { id: 7, name: 'Galle', province_id: 3 },
              { id: 8, name: 'Matara', province_id: 3 },
              { id: 9, name: 'Hambantota', province_id: 3 },
            ]);
          } else {
            setDistricts([
              { id: 10, name: 'District Area', province_id: selectedProvince },
            ]);
          }
        }
      } catch {
        setDistricts([
          { id: 1, name: 'Colombo', province_id: 1 },
          { id: 2, name: 'Gampaha', province_id: 1 },
          { id: 3, name: 'Kalutara', province_id: 1 },
        ]);
      }
    })();
  }, [selectedProvince]);

  // 3. When District Changes, fetch Cities
  useEffect(() => {
    if (!selectedDistrict) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    (async () => {
      try {
        const res = await fetch(getApiUrl(`/locations/cities?district_id=${selectedDistrict}`));
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setCities(json.data);
        } else {
          // Fallback cities
          if (Number(selectedDistrict) === 1) {
            setCities([
              { id: 101, name: 'Colombo 01 - Fort', postal_code: '00100' },
              { id: 102, name: 'Colombo 03 - Kollupitiya', postal_code: '00300' },
              { id: 103, name: 'Colombo 04 - Bambalapitiya', postal_code: '00400' },
              { id: 104, name: 'Colombo 05 - Havelock Town', postal_code: '00500' },
              { id: 105, name: 'Dehiwala', postal_code: '10350' },
              { id: 106, name: 'Mount Lavinia', postal_code: '10370' },
              { id: 107, name: 'Nugegoda', postal_code: '10250' },
              { id: 108, name: 'Maharagama', postal_code: '10280' },
              { id: 109, name: 'Kottawa', postal_code: '10230' },
            ]);
          } else if (Number(selectedDistrict) === 2) {
            setCities([
              { id: 201, name: 'Gampaha', postal_code: '11000' },
              { id: 202, name: 'Negombo', postal_code: '11500' },
              { id: 203, name: 'Kelaniya', postal_code: '11600' },
              { id: 204, name: 'Wattala', postal_code: '11300' },
              { id: 205, name: 'Kiribathgoda', postal_code: '11600' },
            ]);
          } else {
            setCities([
              { id: 301, name: 'Main Town / City Center', postal_code: '00000' },
            ]);
          }
        }
      } catch {
        setCities([
          { id: 101, name: 'Colombo 01 - Fort', postal_code: '00100' },
          { id: 102, name: 'Colombo 03 - Kollupitiya', postal_code: '00300' },
          { id: 103, name: 'Colombo 04 - Bambalapitiya', postal_code: '00400' },
          { id: 104, name: 'Dehiwala', postal_code: '10350' },
          { id: 105, name: 'Nugegoda', postal_code: '10250' },
        ]);
      }
    })();
  }, [selectedDistrict]);

  const handleProvinceSelect = (pId: string) => {
    const id = pId ? Number(pId) : '';
    const pObj = provinces.find((p) => p.id === id);
    setSelectedProvince(id);
    setSelectedDistrict('');
    setSelectedCity('');

    onChange({
      provinceId: id,
      provinceName: pObj?.name || '',
      districtId: '',
      districtName: '',
      cityId: '',
      cityName: '',
      postalCode: '',
    });
  };

  const handleDistrictSelect = (dId: string) => {
    const id = dId ? Number(dId) : '';
    const pObj = provinces.find((p) => p.id === selectedProvince);
    const dObj = districts.find((d) => d.id === id);
    setSelectedDistrict(id);
    setSelectedCity('');

    onChange({
      provinceId: selectedProvince,
      provinceName: pObj?.name || '',
      districtId: id,
      districtName: dObj?.name || '',
      cityId: '',
      cityName: '',
      postalCode: '',
    });
  };

  const handleCitySelect = (cId: string) => {
    const id = cId ? Number(cId) : '';
    const pObj = provinces.find((p) => p.id === selectedProvince);
    const dObj = districts.find((d) => d.id === selectedDistrict);
    const cObj = cities.find((c) => c.id === id);
    setSelectedCity(id);

    onChange({
      provinceId: selectedProvince,
      provinceName: pObj?.name || '',
      districtId: selectedDistrict,
      districtName: dObj?.name || '',
      cityId: id,
      cityName: cObj?.name || '',
      postalCode: cObj?.postal_code || '',
    });
  };

  // No-border input with just 2px bottom border
  const selectClass =
    'w-full px-3.5 py-3 bg-slate-50/70 hover:bg-slate-100/70 focus:bg-white border-0 border-b-2 border-slate-300 focus:border-b-2 focus:border-blue-600 rounded-t-[3px] font-bold text-slate-900 focus:outline-none transition cursor-pointer text-sm';
  const labelClass = 'block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5';

  return (
    <div className="space-y-4 text-xs">
      {/* Row: Province */}
      <div>
        <label className={labelClass}>
          Province {required && '*'}
        </label>
        <div className="relative">
          <select
            required={required}
            value={selectedProvince}
            onChange={(e) => handleProvinceSelect(e.target.value)}
            className={selectClass}
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} Province {p.code ? `(${p.code})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row: District */}
      <div>
        <label className={labelClass}>
          District {required && '*'}
        </label>
        <div className="relative">
          <select
            required={required}
            disabled={!selectedProvince}
            value={selectedDistrict}
            onChange={(e) => handleDistrictSelect(e.target.value)}
            className={`${selectClass} disabled:bg-slate-100/60 disabled:text-slate-400 disabled:cursor-not-allowed`}
          >
            <option value="">
              {!selectedProvince ? 'Select Province First' : 'Select District'}
            </option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row: City / Town */}
      <div>
        <label className={labelClass}>
          City / Town (Cisty) {required && '*'}
        </label>
        <div className="relative">
          <select
            required={required}
            disabled={!selectedDistrict}
            value={selectedCity}
            onChange={(e) => handleCitySelect(e.target.value)}
            className={`${selectClass} disabled:bg-slate-100/60 disabled:text-slate-400 disabled:cursor-not-allowed`}
          >
            <option value="">
              {!selectedDistrict ? 'Select District First' : 'Select City / Town'}
            </option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.postal_code ? `(Postal: ${c.postal_code})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
