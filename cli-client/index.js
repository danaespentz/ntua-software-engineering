#! /usr/bin/env node 
//--no-warnings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const commander = require("commander");
const axios = require ('axios');
const program = new commander.Command();
const fs = require('fs');

program 
    .version('1.0.0')
    .description('Command Line Interface Software Engineering NTUA 2023');


// Handle unknown commands
program
    .arguments('<command...>')
    .action((command) => {
    console.error(`Unknown command: ${command.join(' ')}`);
    console.error(`type --help for additional information`);
  });

//CLI "admin" commands
program 
    .command('healthcheck')
    .helpOption('-h, --help', 'Display help for command')
    .action(function(){
        let url='https://localhost:9876/ntuaflix/api/admin/healthcheck';
        axios.get(url).then( resp=>{
            console.log(resp.data);
        })
    });

program 
    .command('resetall')
    .action(function(){
        let url='https://localhost:9876/ntuaflix/api/admin/resetall';
        axios.post(url)
            .then(resp => {
                console.log(resp.data);
            })
            .catch(error => {
                console.error("Error during healthcheck:", error);
            });
    });

program
    .command('login')
    .description('login')
    .requiredOption('--user_name <user_name>', 'Specify the username')
    .requiredOption('--user_password <user_password>', 'Specify the password')
    .action((options) => {
        const user_name = options.user_name;
        const user_password = options.user_password;
        const url = `https://localhost:9876/ntuaflix/api/login`;

        axios.post(url, null, {
            params: {
                user_name: user_name,
                user_password: user_password
            }
        })
        .then(resp => {
            console.log(resp.data);
        })
    });

program
  .command('logout')
  .description('Logout')
  .action(function(){
    const url = `https://localhost:9876/ntuaflix/api/logout`;
  axios.post(url).then( resp => {
    console.log(resp.data);
});
});

program
  .command('adduser')
  .description('adduser')
  .requiredOption('--username <username>', 'Specify the username')
  .requiredOption('--password <password>', 'Specify the password')
  .action((options) => {
    const username = options.username;
    const password = options.password;
    const url = `https://localhost:9876/ntuaflix/api/admin/userMod/${username}/${password}`;
  axios.post(url)
    .then(resp => {
    console.log(resp.data);
});
});

program
  .command('user')
  .description('userInfo')
  .requiredOption('--username <username>', 'Specify the username')
  .action((options) => {
    const username = options.username;
    const url = `https://localhost:9876/ntuaflix/api/admin/userInfo/${username}`;
  axios.post(url)
    .then(resp => {
    console.log(resp.data);
  });
});

program
    .command('title')
    .description('Display the movie with this title')
    .requiredOption('--titleID <titleID>', 'Specify the title ID')
    .option('--format <format>', 'Specify the format json/csv')
    .action((options) => {
      const titleID = options.titleID || '';
      const format = options.format || 'json';
      const url = `https://localhost:9876/ntuaflix/api/title/${titleID}`;
    axios.get(url, {params:{format: format}}).then( resp => {
      console.log(resp.data);
  });
  });

program
    .command('name')
    .description('Display the actor with this name')
    .requiredOption('--nameID <nameID>', 'Specify the name ID')
    .option('--format <format>', 'Specify the format json/csv')
    .action((options) => {
      const nameID = options.nameID || '';
      const format = options.format || 'json';
      const url = `https://localhost:9876/ntuaflix/api/name/${nameID}`;
    axios.get(url, {params:{format: format}}).then( resp => {
      console.log(resp.data);
    });
    });

program
    .command('searchtitle')
    .description('Search a movie with this title')
    .requiredOption('--titlepart <titlepart>', 'Specify the title to search')
    .option('--format <format>', 'Specify the format json/csv')
    .action((options) => {
      const title = options.titlepart || '';
      const format = options.format || 'json';
      const url = `https://localhost:9876/ntuaflix/api/searchtitle`;
    axios.get(url, {params:{titlePart: title, format: format}})
      .then(resp => {
        console.log(resp.data);
      });
    });

program
    .command('searchname')
    .description('Search a movie that contains this name')
    .requiredOption('--namepart <namepart>', 'Specify the name to search')
    .option('--format <format>', 'Specify the format json/csv')
    .action((options) => {
      const name = options.namepart || '';
      const format = options.format || 'json';
      const url = `https://localhost:9876/ntuaflix/api/searchname`;
    axios.get(url, {params:{namePart: name, format: format}})
      .then(resp => {
        console.log(resp.data);
      });
    });

program
    .command('bygenre')
    .description('Search a movie with these parameters')
    .requiredOption('--genre <genre>', 'Specify the genre')
    .requiredOption('--min <min>', 'Specify the minimum rating of the movie')
    .option('--from <from>', 'Specify the start year of the movie')
    .option('--to <to>', 'Specify the end year of the movie')
    .option('--format <format>', 'Specify the format json/csv')
    .action((options) => {
      const genre = options.genre;
      const min = options.min;
      const from = options.from || '';
      const to = options.to || '';
      const format = options.format || 'json';
      const url = `https://localhost:9876/ntuaflix/api/bygenre`;

      if (!genre || !min) {
        console.error('Missing required parameters. Please provide values for qgenre and minrating.');
        program.help(); 
      } else {
        axios.get(url, {params: {qgenre:genre, minrating:min, yrFrom:from, yrTo:to, format: format}})
        .then(resp => {
          console.log(resp.data);
        });
      }
    });

//CLI "upload" commands
  program
    .command('newakas')
    .description('Upload movie titles')
    .requiredOption('--filename <path>', 'Path to the file to upload')

    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/admin/upload/titleakas`;

    try {
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Make a POST request to the API endpoint with the file as FormData
      const response = await axios.post(endpoint, fileBuffer, {
          headers: {
              'Content-Type': 'text/plain', // Set the content type based on the file type
          },
      });

      console.log('Upload successful. Response:', response.data);
  } catch (error) {
      console.error('Error during upload:', error.message);
  }
});

    program
    .command('newtitles')
    .description('Upload new titles')
    .requiredOption('--filename <path>', 'Path to the file to upload')
    .action(async (options) => {
        const filePath = options.filename;
        const endpoint = `https://localhost:9876/ntuaflix/api/admin/upload/titlebasics`;

        try {
            // Read the file as a buffer
            const fileBuffer = fs.readFileSync(filePath);

            // Make a POST request to the API endpoint with the file as FormData
            const response = await axios.post(endpoint, fileBuffer, {
                headers: {
                    'Content-Type': 'text/plain', // Set the content type based on the file type
                },
            });

            console.log('Upload successful. Response:', response.data);
        } catch (error) {
            console.error('Error during upload:', error.message);
        }
    });

  program
    .command('newnames')
    .description('Upload actor names')
    .requiredOption('--filename <path>', 'Path to the file to upload')

    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/admin/upload/namebasics`;
    try {
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Make a POST request to the API endpoint with the file as FormData
      const response = await axios.post(endpoint, fileBuffer, {
          headers: {
              'Content-Type': 'text/plain', // Set the content type based on the file type
          },
      });

      console.log('Upload successful. Response:', response.data);
  } catch (error) {
      console.error('Error during upload:', error.message);
  }
});

  program
    .command('newcrew')
    .description('Upload crew names')
    .requiredOption('--filename <path>', 'Path to the file to upload')

    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/admin/upload/titlecrew`;

    try {
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Make a POST request to the API endpoint with the file as FormData
      const response = await axios.post(endpoint, fileBuffer, {
          headers: {
              'Content-Type': 'text/plain', // Set the content type based on the file type
          },
      });

      console.log('Upload successful. Response:', response.data);
  } catch (error) {
      console.error('Error during upload:', error.message);
  }
});

  program
    .command('newepisode')
    .description('Upload new episodes')
    .requiredOption('--filename <path>', 'Path to the file to upload')

    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/admin/upload/titleepisode`;
    try {
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Make a POST request to the API endpoint with the file as FormData
      const response = await axios.post(endpoint, fileBuffer, {
          headers: {
              'Content-Type': 'text/plain', // Set the content type based on the file type
          },
      });

      console.log('Upload successful. Response:', response.data);
  } catch (error) {
      console.error('Error during upload:', error.message);
  }
});

  program
    .command('newprincipals')
    .description('Upload contributor names')
    .requiredOption('--filename <path>', 'Path to the file to upload')

    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/admin/upload/titleprincipals`;

    try {
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Make a POST request to the API endpoint with the file as FormData
      const response = await axios.post(endpoint, fileBuffer, {
          headers: {
              'Content-Type': 'text/plain', // Set the content type based on the file type
          },
      });

      console.log('Upload successful. Response:', response.data);
  } catch (error) {
      console.error('Error during upload:', error.message);
  }
});

  program
    .command('newratings')
    .description('Upload new ratings')
    .requiredOption('--filename <path>', 'Path to the file to upload')

    .action(async (options) => {
    const filePath = options.filename;
    const endpoint = `https://localhost:9876/ntuaflix/api/admin/upload/titleratings`;

    try {
      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Make a POST request to the API endpoint with the file as FormData
      const response = await axios.post(endpoint, fileBuffer, {
          headers: {
              'Content-Type': 'text/plain', // Set the content type based on the file type
          },
      });

      console.log('Upload successful. Response:', response.data);
  } catch (error) {
      console.error('Error during upload:', error.message);
  }
});

//help command
program
    .helpOption('-h, --help', 'Display help for commands')

program.parse(process.argv);