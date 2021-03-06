import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InputTextField } from '../../../components/Form/InputTextField/InputTextField';
import HeaderReturn from '../../../components/HeaderReturn/HeaderReturn';
import ButtonLarge from '../../../components/Form/ButtonLarge/ButtonLarge';
import userApi from '../../../utilities/api/user.api';
import './ChangePassword.css';

interface PasswordChange {
  password_old: string,
  password_new: string,
  password_confirm?: string,
}

function ChangePassword() {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordChange>({
    defaultValues: {
      password_old: '',
      password_new: '',
      password_confirm: '',
    },
  });
  const password = useRef({});
  password.current = watch('password_new', '');

  const onSubmit = async (formData: PasswordChange) => {
    const passwordData = formData;
    delete passwordData.password_confirm;
    const response = await userApi.editUserPassword(Number(localStorage.getItem('id_user')), passwordData);
    if (response.ok === false) {
      if (response.status === 400) setErrorMessage('Wrong Password');
      if (response.status === 404) setErrorMessage('404 not found');
      if (response.status === 500) setErrorMessage('500 server error');
      if (response.status === 503) setErrorMessage('503 service unavailable');
    } else if (response.data) {
      navigate('/profile');
    }
  };

  return (
    <div className="cp__main-container">
      <HeaderReturn
        text="Change Password"
      />
      <div className="cp__container">
        <form
          className="cp__form-container"
          onSubmit={handleSubmit(onSubmit)}
        >

          <div className="cp__input-cotainer">
            <InputTextField
              type="password"
              label="Current password"
              errorMessage={errors.password_old?.message}
              {...register('password_old', {
                required: 'This field is required',
              })}
            />
            <br />
            <br />
            <InputTextField
              type="password"
              label="New password"
              errorMessage={errors.password_new?.message}
              {...register('password_new', {
                required: 'This field is required',
                minLength: {
                  value: 8,
                  message: 'Minimun length 8 characters',
                },
              })}
            />
            <InputTextField
              type="password"
              label="Confirm new password"
              errorMessage={errors.password_confirm?.message}
              {...register('password_confirm', {
                validate: (value) => value === password.current || 'Passwords do not match',
              })}
            />
          </div>
          <ButtonLarge
            type="submit"
            value="Save Changes"
            style="fill"
          />
          {(errorMessage !== '')
          && <p>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
