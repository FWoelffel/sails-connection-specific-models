# sails-connection-specific-models
This hook runs on models loading. It creates connection-specific models.

## Configuration example
``` javascript
module.exports.ConnectionSpecificModels = {

  active: true,
  removeOriginals: true,
  targets: [
    {models: [
      'Model_A',
      'Model_B'
    ],
    connections: [
      'Conn_A'
    ]},
    {models: [
      'Model_A',
      'Model_B',
      'Model_C'
    ],
      connections: [
        'Conn_B'
      ]}
  ]

};
```
Will generate the following connection-specific models :
* Model_A_Conn_A
* Model_B_Conn_A
* Model_A_Conn_B
* Model_B_Conn_B
* Model_C_Conn_B

And will remove :
* Model_A
* Model_B
* Model_C
