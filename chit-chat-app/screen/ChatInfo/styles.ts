import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333",
      marginLeft: 20,
      marginVertical: 20,
    },
    groupImage: {
      width: 180,
      height: 180,
      marginTop: 20,
      borderRadius: 90,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: "center",
      marginBottom: 10,
      backgroundColor: "#007bff",
    },
    name: {
 fontWeight: '700',
 fontSize: 20.
    },
    containerInfo: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 0.5,
      padding: 20,
      backgroundColor: "white",
    },
    iconInfo: {
      height: 24,
      width: 24,
      marginRight: 12,
    },
    titleAbout: {
      fontSize: 18,
      fontWeight: "600",
    },
    description: {
      fontSize: 14,
    },
    memberContainer: {
      flexDirection: "row",
      padding: 12,
      alignItems: "center",
    },
    memberAvatar: {
      height: 40,
      width: 40,
      marginRight: 12,
      borderRadius: 20,
    },
    memberName: {
      fontSize: 18,
      fontWeight: "700",
    },
    memberEmail: { fontSize: 14 },
  });