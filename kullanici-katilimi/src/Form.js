import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';

import './Form.css'

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    terms: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    terms: '',
  });

  const [kullanicilar, setKullanicilar] = useState([]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Ad ve soyad zorunludur.'),
        email: Yup.string().email('Geçerli bir email adresi girin.').required('Email zorunludur.'),
        password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır.').required('Şifre zorunludur.'),
        terms: Yup.boolean().oneOf([true], 'Kullanım şartlarını kabul etmelisiniz.'),
      });

      await schema.validate(formData, { abortEarly: false });

      // Formu doğrulama başarılı
      const response = await axios.post('https://reqres.in/api/users', formData);
      console.log('POST Response:', response.data);

      setKullanicilar((prevKullanicilar) => [...prevKullanicilar, response.data]);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors = {};
        err.inner.forEach((validationError) => {
          newErrors[validationError.path] = validationError.message;
        });
        setErrors(newErrors);
      } else {
        console.error('POST Error:', err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='div1'>
        <label className='label1' htmlFor="name">Ad ve Soyad:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span>{errors.name}</span>}
      </div>
      <div className='div2'>
        <label  className='label2' htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span>{errors.email}</span>}
      </div>
      <div className='div3'>
        <label className='label3' htmlFor="password">Şifre:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <div className='div4'>
        <label className='label4'  htmlFor="terms">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          Kullanım Şartlarına Kabul Ediyorum.
        </label>
        {errors.terms && <span>{errors.terms}</span>}
      </div>
      <button type="submit">Gönder</button>
      <div>
        <h2>Kullanıcılar</h2>
        <pre>{JSON.stringify(kullanicilar, null, 2)}</pre>
      </div>
    </form>
  );
};

export default Form;