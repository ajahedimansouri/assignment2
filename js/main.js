/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Alireza Mansouri    Student ID: 110815206     Date: 2023-09-29
*
********************************************************************************/ 
import fetch from 'node-fetch';
const API_URL = 'https://adorable-hen-tights.cyclic.cloud/'
//'http://localhost:8080'; 
let page = 1;
const perPage = 10;

// Function to load company data from the server
const loadCompanyData = (tag = null) => {
  // Construct the API URL based on the tag and page
  const apiUrl = tag
    ? `${API_URL}/api/companies?page=${page}&perPage=${perPage}&tag=${tag}`
    : `${API_URL}/api/companies?page=${page}&perPage=${perPage}`;

  // Fetch data from the Assignment 1 
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {

      if (data && data.length > 0) {

        updateTable(data);
      } else {

        console.log('No data found.');
      }
    })
    .catch((error) => console.error(error));
};

//update the table with fetched data
const updateTable = (data) => {

  const tableBody = document.querySelector('#companiesTable tbody');

  // Clear existing rows from the table
  tableBody.innerHTML = '';

  // add rows to the table
  data.forEach((company) => {
    // Create a new row
    const row = document.createElement('tr');
    row.setAttribute('data-id', company.name);

    // Add columns to the row
    row.innerHTML = `
      <td>${company.name || '--'}</td>
      <td>${company.category_code || '--'}</td>
      <td>${company.description || '--'}</td>
      <td>${formatDate(company.founded_year, company.founded_month, company.founded_day) || '--'}</td>
      <td>${getFirstFounderName(company.relationships) || '--'}</td>
      <td>${getFirstOfficeLocation(company.offices) || '--'}</td>
      <td>${company.number_of_employees || '--'}</td>
      <td>${formatTags(company.tag_list) || '--'}</td>
      <td>${company.homepage_url || '--'}</td>
    `;

    // Add the row to the table
    tableBody.appendChild(row);
  });

  // Update the current page number
  document.querySelector('#current-page').textContent = page;
};

// format date as MM/DD/YYYY
const formatDate = (year, month, day) => {
  if (year && month && day) {
    return `${month}/${day}/${year}`;
  }
  return null;
};

//get the first founder
const getFirstFounderName = (relationships) => {
  if (Array.isArray(relationships)) {
    for (const relation of relationships) {
      if (relation.title.includes('Founder')) {
        return relation.first_name + ' ' + relation.last_name;
      }
    }
  }
  return null;
};

// get the location of the first office
const getFirstOfficeLocation = (offices) => {
  if (Array.isArray(offices) && offices.length > 0) {
    const office = offices[0];
    return `${office.city || ''}, ${office.state_code || ''}, ${office.country_code || ''}`;
  }
  return null;
};

// tags and limit to first two
const formatTags = (tagList) => {
  if (tagList) {
    const tags = tagList.split(',');
    return tags.slice(0, 2).join('<br />');
  }
  return null;
};

loadCompanyData();


document.querySelector('#previous-page').addEventListener('click', () => {
  if (page > 1) {
    page--;
    loadCompanyData();
  }
});


document.querySelector('#next-page').addEventListener('click', () => {
  page++;
  loadCompanyData();
});
