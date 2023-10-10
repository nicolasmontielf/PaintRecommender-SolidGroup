## Generate JSON

### Page
https://json-generator.com/

### Body
```

[
  '{{repeat(5, 7)}}',
  {
    id: '{{objectId()}}',
    name: '{{lorem(2, "words")}}',
    parts: [
      '{{repeat(2)}}',
      {
        proportion: '{{integer(20, 90)}}',
        bucketsSizes: [
          '{{repeat(16)}}',
          {
            country: '{{random("GUA", "PY", "CH", "AR")}}',
            presentation: '{{random("balde", "galon", "cuarto", "tambor")}}',
            liters: function(tags) {
              switch (this.presentation) {
                case "balde":
                  return tags.integer(10, 18);
                  
                case "galon":
                  return tags.integer(4, 8);
                  
                case "cuarto":
                  return tags.integer(1, 3);
                  
                case "tambor":
                  return tags.integer(30, 90);
              }
            },
            price: function() {
              return ((this.liters * 10) - (this.liters * 2));
            }
          }
        ]
      }
    ]
  }
]
```