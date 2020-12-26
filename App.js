
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
import axios from 'axios'

const App = () => {

  let [data, setData] = useState([])
  const [refreshing, setRefresh] = useState(false)
  let [refreshCount, setRefreshCount] = useState(0)
  let [seen, setSeen] = useState(0)
  let [isSearch, setIsSearch] = useState(false)
  const [value, setValue] = useState('')
  const [info,setInfo]=useState({})


  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    setRefresh(true)
    setRefreshCount(refreshCount + 1)
    await axios.get(`https://api.giphy.com/v1/gifs/trending?api_key=1qw0LMQQi1xZYgYC4Di1Cc3p89X2ZQCE&limit=20&offset=${refreshCount}`)
      .then(response => {
        setData([...data, ...response.data.data])
        setInfo(response.data.pagination)
        console.log(refreshCount)
        console.log('length: ', data.length)
      }).catch(err => {
        setRefresh(false)
        console.log('api error ', err)
      })
    setRefresh(false)
  }

  const searchTerm = async (text) => {
    setRefresh(true)
    setRefreshCount(refreshCount + 1)
    await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=1qw0LMQQi1xZYgYC4Di1Cc3p89X2ZQCE&limit=20&offset=${refreshCount}&q=${text}`)
      .then(response => {
        setData([...data, ...response.data.data])
        setInfo(response.data.pagination)
      }).catch(err => {
        setRefresh(false)
        console.log('api error ', err)
      })
    setRefresh(false)
  }

  const renderItem = ({ item }) => {
    return (
      <View style={{ padding: 5, width: "25%", height: 200 }}>
        <Image style={{ flex: 1 }}
          source={{ uri: item.images.original.url }}
        />
      </View>
    )
  }

  const renderFooter = () => {
    return refreshing ? (
      <View style={{ paddingVertical: 20}}>
        <ActivityIndicator size="large" />
      </View>
    ) : <TouchableOpacity style={{ paddingVertical: 20, backgroundColor: "red", alignItems: "center" }} onPress={() => isSearch === false ? getData() : onChangeText(value)}>
        <Text style={{ color: "blue" }}>Load More</Text>
      </TouchableOpacity>
  }

  const getMoreImages = () => {
    if (seen === 0) {
      setRefresh(true)
      isSearch === false ? getData() : onChangeText(value)
      setSeen(seen + 1)
    } else if (seen === 10) {
    }
  }

  function clearWidget() {
    refreshCount = 0
    data = []
  }

  const onChangeText = (text) => {
    setIsSearch(true)
    setSeen(0)
    searchTerm(text)
  }

  return (
    <SafeAreaView>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 10 }}
        onChangeText={text => {
          setValue(text)
          clearWidget()
          onChangeText(text)
          if (text === "") {
            clearWidget()
            setSeen(0)
            getData()
          }
        }}
        value={value}
        placeholder="Search all the GIFs"
      />
      <View style={{ flexDirection: "row",marginTop:10 }}>
        <Text style={{ fontWeight: "bold" }}>Trending  </Text>
        <Text>Showing 1-{data.length} of </Text>
        <Text>{info?.total_count} results</Text>
      </View>
      <FlatList
        style={{ padding: 5 }}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        data={data}
        extraData={data}
        numColumns={4}

        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0}
        onEndReached={getMoreImages}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

});

export default App;
