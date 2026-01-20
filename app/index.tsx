import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

export default function Index() {
    // If redirect fails, at least we see this
    return (
        <>
            <Redirect href="/loginpage" />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Redirecting to Login...</Text>
            </View>
        </>
    );
}
