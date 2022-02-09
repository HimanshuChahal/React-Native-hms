import React, { useState, useRef, useEffect  } from 'react'
import { Text, TouchableOpacity, View, PermissionsAndroid } from 'react-native'
import HmsManager from '@100mslive/react-native-hms'

export default ({ navigation }) => {

    const [ loading, setLoading ] = useState(true)

    const hmsInstace = useRef(null)

    const checkPermissions = async () => {

        const permissions = await PermissionsAndroid.requestMultiple([ PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO ])

        console.log(permissions)

        if(permissions['android.permission.CAMERA'] === 'granted' && permissions['android.permission.RECORD_AUDIO'] === 'granted')
        {
            HmsManager.build().then(instance => {
                hmsInstace.current = instance
    
                setLoading(false)
            }).catch(err => console.log(err))
        } else
        {
            await PermissionsAndroid.requestMultiple([ PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO ])
        }

    }

    useEffect(() => {

        checkPermissions()
        
    }, [])

    return (
        loading ? (
                <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    <Text>Loading.....</Text>

                </View>
            ) : (
                <View style = {{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                    <TouchableOpacity style = {{ paddingVertical: 7, paddingHorizontal: 20, borderRadius: 10, backgroundColor: 'black' }}
                    onPress = {() => {
                        navigation.navigate('Video', { instance: hmsInstace.current })
                    }}>

                        <Text style = {{ color: 'white' }}>

                            Join

                        </Text>

                    </TouchableOpacity>

                </View>
            )
    )

}
