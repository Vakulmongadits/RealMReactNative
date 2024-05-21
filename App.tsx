import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, Dimensions, Text, Image, StyleSheet } from "react-native";
const { width } = Dimensions.get('window');
const Realm = require('realm');

const PRODUCTS_SCHEMA = 'products';
const EventsSchema = {
  name: PRODUCTS_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: 'string',
    description: 'string',
    thumbnail: 'string',
  }
};

const databaseOptions = {
  path: 'realmT4.realm',
  schema: [EventsSchema],
  schemaVersion: 0
};

const App = () => {

  const [data, setData] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(response => {
        console.log(response)
        saveDataInDB(response.products)
      })
  }

  const saveDataInDB = (data: any) => {
    Realm.open(databaseOptions).then((realm: any) => {
      realm.write(() => {
        for (let elem of data) {
          console.log('saveDataInDB -> ', elem)
          let data = {
            id: elem.id,
            title: elem.title,
            description: elem.description,
            thumbnail: elem.thumbnail,
          }
          realm.create(PRODUCTS_SCHEMA, data);
        }

      });
    })

    getDataFromDB()
  }

  const getDataFromDB = () => {
    Realm.open(databaseOptions).then(realm => {
      let dbData = realm.objects(PRODUCTS_SCHEMA);
      console.log('dbData dbData --> ', dbData)
      setData(dbData)
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={data}
        extraData={data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item, index }) => {
          return <ProductsItem item={item} index={index} />
        }} />
    </SafeAreaView>
  )
}

export default App;

const ProductsItem = ({ item, index }: any) => {
  return (
    <View style={styles.itemContainerProduct}>
      <Image source={{ uri: item.thumbnail }} style={styles.imageProductItem} />
      <Text style={styles.textProductItemTitle}>{item.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  itemContainerProduct: {
    height: 60,
    width: width - 36,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageProductItem: {
    height: 50,
    width: 50,
  },
  textProductItemTitle: {
    flex: 1,
    fontSize: 16,
    marginStart: 10
  }
})