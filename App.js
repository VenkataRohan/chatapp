import * as React from 'react';
import { StyleSheet, Text, TextInput,TouchableOpacity, View, Button, FlatList, TouchableHighlight, Modal, Alert } from 'react-native';
const { io } = require("socket.io-client");
const socket= io("http://10.59.97.155:3001");
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
ar=[]
const Login = ({ navigation, route }) => {
  const [m,setM]=React.useState('')
  const getFriends= async (user)=>{
    const unmounted=false
    if(!unmounted)
    {
        fetch('http://10.59.97.155:3001/friends',{
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
        },
          body:JSON.stringify({         
            name:user
          })    
          
           })
           .then((response) => response.json())
           .then((json) => {
             const t=[]
             for(let i=0;i<json[0].friends.length;i++)
             {
               let key=Object.keys(json[0].friends[i])
                t[i]={
                  id:key[0],
                  name:json[0].friends[i][key[0]]
                }
             }

             console.log('sdfdasda');
             navigation.navigate('Friends', {arr: t ,from : user})


          })
           .catch((err)=>{
             //console.log(err);
           })
      }

    }
      const fun= ()=>{
       getFriends(m)
          socket.emit('addUser', m,socket.id);
          setM("");        
      }
  return (
    <View>
    <View style={styles.textInput}>
    <TextInput 
    value={m}
    onChangeText={(val)=>setM(val)}/>
    <Button
      title="Send"
      onPress={fun}
    />
    </View>
    
  
    </View>
    );
};

const Friends=({ navigation,route })=>{
  const {arr,from}=route.params
console.log(arr);
console.log(from);
React.useEffect(()=>{

  return ()=>console.log("stopped");
})
const getMsg=  (f,t)=>{
   // const abort=new AbortController()
  // fetch('http://10.59.97.155:3001/getMsg',{
  //   method:'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  // },
  //   body:JSON.stringify({         
  //     from:f,
  //     to:t
  //   })    
    
  //    })
  //    .then((response) => response.json())
  //    .then((json) => {
  //      const temp=[]
  //      for(let i=0;i<json.length;i++)
  //      {
  //         temp[i]={m:json[i].msg,id:json[i]._id}
  //      }
       
       navigation.navigate('chatSc', {to:t,from:f})
       
  //   })
  //    .catch((err)=>{
  //      //console.log(err);
  //    })
}


  const onPress=(num)=>{
      getMsg(from,num)
    
    //console.log(num);
  }
  return (
  <FlatList 
  data={arr}
  renderItem={({ item }) =>
 
        <TouchableOpacity
        style={styles.button}
        onPress={()=>onPress(item.id)}>
        <Text>{item.name}</Text>
      </TouchableOpacity> 
  }
  keyExtractor={(item =>item.id)}
 
  />

  );
}



const ChatSc = ({ navigation,route }) => {
  const [arr,setArr]=React.useState([])
  const {to,from}=route.params
  React.useEffect(()=>{
    let unmounted=false

    if(!unmounted)
    {
    fetch('http://10.59.97.155:3001/getMsg',{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
  },
    body:JSON.stringify({         
      from:from,
      to:to
    })    
    
     })
     .then((response) => response.json())
     .then((json) => {
       const temp=[]
       for(let i=0;i<json.length;i++)
       {
          temp[i]={m:json[i].msg,id:json[i]._id}
       }
       
       setArr(temp)
       
    })
     .catch((err)=>{
       //console.log(err);
     })
console.log("asdasd");
   
    socket.on("aa",(msg) => {
        setArr(msg)     
    });
  }
  return ()=>{
    socket.off("aa")
    unmounted=true
  }
  },[])
    
     const [m,setM]=React.useState('')

     const sendMsg=(msg)=>{
          fetch('http://10.59.97.155:3001/bb',{
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
          },
            body:JSON.stringify({
              name:msg
            })    
          
             })
        }
      const fun=()=>{
      
        socket.emit('chat', m,to,from);
        setM('')
      }
    return (

    <View>
    <View style={styles.textInput}>
     <TextInput 
     value={m}
     onChangeText={(val)=>setM(val)}/>
     <Button onPress={fun} title="send"/>
     </View>
     <FlatList 
     data={arr}
     renderItem={({ item }) =>
    
       <Text>{item.m}</Text>  
     }
     keyExtractor={(item =>item.id)}
    
     />
    
    </View>

   
  );
};





const Friend=(prop)=>{
  return (
    <View>
    <TouchableOpacity
    style={styles.button}
    onPress={onPress}
  >
    <Text>Press Here</Text>
  </TouchableOpacity>
    </View>
  );
}



const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="Friends"
          component={Friends}
          options={{ title: 'Friends' }}
        />
        <Stack.Screen name="chatSc" component={ChatSc} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  task: {
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: 'yellow',
    paddingHorizontal: 6,
    paddingVertical: 15
  },
  container: {
    paddingTop:40,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    display: "flex",
    alignItems: "center",
    marginVertical: 20,
  },
  textInput:{
    backgroundColor:'yellow',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});



export default App;
