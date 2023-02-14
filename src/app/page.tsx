import Channelbar from "@/components/ChannelBar";
import ContentContainer from "@/components/ContentContainer";
import SideBar from "@/components/SideBar";

function App() {
  return (
    <div className="flex">
      <SideBar />
      <Channelbar />
      <ContentContainer />x
    </div>
  );
}

export default App;
