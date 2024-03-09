import axios from 'axios';

export const avgSalary = () => {
  return axios.get(
    'https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&lang=PT&varcd=0006911&Dim1=S7A2021&Dim2=PT&Dim3=R&Dim4=T'
  );
};
