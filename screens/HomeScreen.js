import React from 'react';
import { View, Button, Image, Platform, Text, StyleSheet} from 'react-native'; 
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class HomeScreen extends React.Component{
    state = {
        image:null
    }

    pickImage=async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({image:result.data});
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(E){
            console.log(E)
        }
    }

    uploadImage=async(uri)=>{
        const data = new FormData();
        let fileName = uri.split("/")[uri.split("/").length -1]
        let type = 'image/${uri.split(".")[uri.split(".").length - 1]}'

        const fileToUpload = {
            uri:uri,
            name:fileName,
            type:type 
        } 
        data.append("digit",fileToUpload)

        fetch({
            method:"POST",
            body:data,
            headers:{
                "content-type":"multipart/form-data"
            }
        })
        .then((response)=>response.json())
        .then((result)=>{
            console.log("success",result)
        })
        .catch((error)=>{
            console.error("error",error)
        })
    }

    getPermission=async()=>{
        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== "granted"){
                alert("Sorry, we need camera permissions to make this work.")
            }
        }

    }

    componentDidMount(){
        this.getPermission();
    }

    render(){
        let {image} = this.state;
        return(
            <View style={styles.container}>
               <Button 
                title = "Pick an image"
                onPress={this.pickImage}
               />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    }
})