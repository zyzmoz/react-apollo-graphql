import { Divider } from "antd";

const getStyles = () => ({
  title: {
    fontSize: 32,
    padding: "0", 
    margin: "0",
    textTransform: "uppercase"
  },
});

const Title = () => {
  const styles = getStyles();

  return (
    <>
      <h1 style={styles.title}>People and Their Cars</h1>
      <Divider></Divider>
    </>
  );
};

export default Title;
