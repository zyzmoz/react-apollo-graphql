import { useQuery } from "@apollo/client";
import { List } from "antd";
import { GET_PEOPLE_AND_CARS } from "../../queries";
import PersonCard from "../listItems/PersonCard";

const getStyles = () => ({
  list: {
    display: "flex",
    justifyContent: "center",
    width: "100%"
  },
  item: {
    width: "100%"
  }
});

const People = () => {
  const styles = getStyles();

  const { loading, error, data } = useQuery(GET_PEOPLE_AND_CARS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <List grid={{ gutter: 20, column: 1 }} style={styles.list}>
      {data.people.map(({ id, firstName, lastName, cars }) => (
        <List.Item key={id} style={styles.item}>
          <PersonCard
            key={id}
            id={id}
            firstName={firstName}
            lastName={lastName}
            cars={cars}
          />
        </List.Item>
      ))}
    </List>
  );
};

export default People;
