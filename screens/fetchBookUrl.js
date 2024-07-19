import {baseURL} from '../config';

const fetchBookUrl = async fileName => {
  try {
    const response = await fetch(`${baseURL}/Book/GetBook${fileName}`);
    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }
    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    return pdfUrl;
  } catch (error) {
    console.error('Error fetching book URL:', error);
  }
};
