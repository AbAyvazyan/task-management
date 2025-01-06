import React from 'react';
import styles from './style.module.scss';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField: React.FC<InputFieldProps> = (props) => {
  return <input className={styles.input} {...props} />;
};

export default InputField;
