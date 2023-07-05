exports.cgi = function (app, path, urlencodedParser) {
  app.post(path, urlencodedParser, function (_, res) {
      const response = {
          error: '',
          msg: '',
          status: true,
          rows: [
              {
                  milestone_name: '1_POC',
                  milestone_status: 2,
                  milestone_start_time: '2023-05-25',
                  milestone_end_time: '2023-06-25',
              },
              {
                  milestone_name: '3_POC',
                  milestone_status: -1,
                  milestone_start_time: '2023-06-26',
                  milestone_end_time: '2023-07-06',
              },
              {
                  milestone_name: '4_POC',
                  milestone_status: 1,
                  milestone_start_time: '2023-07-01',
                  milestone_end_time: '2023-07-13',
              },
              {
                  milestone_name: '5_POC',
                  milestone_status: 0,
                  milestone_start_time: '2023-07-19',
                  milestone_end_time: '2023-07-23',
              },
              {
                  milestone_name: '2_POC',
                  milestone_status: 0,
                  milestone_start_time: '2023-07-25',
                  milestone_end_time: '2023-08-28',
              },
          ]
      };
      res.type('application/json').end(JSON.stringify(response));
  })
};