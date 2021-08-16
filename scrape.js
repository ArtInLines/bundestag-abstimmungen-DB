const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const URL = 'https://www.bundestag.de/parlament/plenum/abstimmung/liste';

//
//
// Plan

// Loop through all pages, stopping at a specific date
// During each loop, collect name, date & link in an object and store it in a list
// Go through the list and download each file, naming the result according the date & name connected to the link
// Read all files, cutting off thefirst lineand piping all files together into one file.
// Possibly add the name of the poll into the data files

// --> Needed functions

// Main Handler () --> void
//      Call all other functions
//      Possibly get input from command line arguments, with defaults hardcoded
// Get-Data-Handler (url, start-date, end-date) --> List of Links
//      Apply dates to the page
//      Call the next function for each page
//      After each call, click button to go to the next page and wait until the results are loaded
//      Add the results of each page together and return the resulting List
// Get data from page (htmlPage) --> Array<Object {name, date, link}>
//      Get the date, name and XLS file-link of all votes on the page via Cheerio
// Download a file (((name, ext, dir) / path), link) --> void
//      Download file via axios, enabling streaming
//      Pipe the resulting stream into a writeFileStream
// Pipe several XLS files into one ((readDirPath / List of FilePaths), writePath, cb, ...args) --> void
//      If readDirPath instead of FilePaths-List, create FilePaths-List, by getting all filepaths into a list
//      Loop through FilePaths-List and for each file, do the following:
//          Read the file & mutate it with cb(file, ...args)
//          Pipe the mutated file into the writeFileStream, which writes into writePath
