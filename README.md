## Praece Sails Model Addons

Model features for Praece sails apps, includes:
- Backreferences for 1:1 relationships
- Calculated fields
- Cascading delete
- Default where query params
- Additional validation types
- New model query methods: `.search` and `.searchCount`
- Updated custom blueprints that include a count blueprint and add search capability to count and find

### Usage:

#### Backreferences
```javascript
// Person.js
module.exports = {
  attributes: {
    name: 'string'
  },

  backReference: {
    pet: {
      model: 'pet',
      via: 'person'
    }
  }
}

// Pet.js
modules.exports = {
  attributes: {
    name: 'string',
    person: {
      model: 'person'
    }
  }
}

Person.findOne(1)
  .then(function(person) {
    console.log(person.pet)

    // output:
    // {
    //   name: 'fluffy',
    //   person: 1
    // }
  });
```

#### Calculated Fields
```javascript
// Person.js
module.exports = {
  attributes: {
    name: 'string',
    dob: 'datetime'
  },

  age: function(persons) {
    return FindAgePromise()
      .then(function(ages) {
        persons.foreach(function(person) {
          person.age = ages[person.id];
        });
      });
  },

  backReference: ['age']
}
```

#### Cascading Delete
```javascript
// Person.js
module.exports = {
  attributes: {
    name: 'string',
    pets: {
      collection: 'pet',
      via: 'person'
    }
  },

  nestedDelete: ['pets']
}
```

#### Default Where Query
```javascript
// Person.js
module.exports = {
  attributes: {
    name: 'string',
    status: 'string'
  },

  defaultWhere: {
    status: 'Active'
  }
}
```

#### Validation
```javascript
// Person.js
module.exports = {
  attributes: {
    name: 'string',
    email: {
      type: 'text',
      required: true,
      unique: true,
      // Test unique before insert to prevent error after creating nested references.
      validateUnique: function(cb) {
        if (this.id) return cb(false);
        Client.count({name: this.name}).then(cb);
      },
      // Test for email.
      isEmail: true
    },
    zip: {
      type: 'text',
      // Test us zipcode.
      isZip: true
    },
    phone: {
      // Test north american phone.
      isPhone: true
    }
  }
}
```

#### .search(`keyword`) and .searchCount(`keyword`)
```javascript
// Person.js
module.exports = {
  attributes: {
    name: 'string',
    nickname: 'string'
  },

  searchableFields: ['name', 'nickname']
}

Person.search('kevin')
  .where({age: 29})
  .then(function(persons) {
    // The name of the first person found based on your search.
    persons[0].name;
  });

Person.searchCount('kevin')
  .where({age: 29})
  .then(function(count) {
    // The number of records that match that search.
    count;
  });
```

#### Count Blueprint
```javascript
request.get('http://test.local/person/count', {params: {age: 29}})
  .then(function(response) {
    // Count of 29 year olds
    response.count;
  });
```

#### Search Blueprint
```javascript
request.get('http://test.local/person', {params: {q: 'kevin', age: 29})
  .then(function(response) {
    // List of 29 year olds with kevin in their name or nickname
    response;
  });
```






