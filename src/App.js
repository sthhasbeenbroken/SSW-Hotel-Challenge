import './App.css';
import {BankOutlined,SearchOutlined,PlusCircleOutlined } from '@ant-design/icons'
import React from 'react';
import { useEffect,useState } from 'react';
import {Menu,Layout,Input, Select, Button, Table ,Modal, Form, message, Space} from 'antd';
import Sider from 'antd/es/layout/Sider';
//import { Option } from 'antd/es/mentions';
import axios from 'axios'
  const {Footer,Header,Content} =Layout;
  const getitems=(label,key,icon)=>{
      return{
        label,
        key,
        icon
      };
    }

function App() {



const columns =[
  {
  title:'编号',
  dataIndex:'ID',
  key:'ID'
  },
  {
    title:'房间名',
    dataIndex:'Name',
    key:'Name'
  },
  {
    title:'状态',
    dataIndex:'Type',
    key:'Type'
  },
  {
    title:'修改时间',
    dataIndex:'GMTModified',
    key:'GMTModified'
  },
  {
    title:'创建时间',
    dataIndex:'GMTCreate',
    key:'GMTCreate',
  },
  {
    title:'操作',
    dataIndex:'Operation',
    key:'Operation',
    render: (_,records)=>{

        if(records.Type==='空闲中'){
        return(
        <Space size='middle'className='inputButton'>
          <Input type="button" size='small'   bordered={false} value={'弃用'} onClick={(e)=>{changestate(e,records.ID);}}/>
          <Input type="button" size='small'  bordered={false} value={'入住'} onClick={(e)=>{changestate(e,records.ID);}}/>
          <Input type="button" size='small'  bordered={false} value={'打扫'} onClick={(e)=>{changestate(e,records.ID);}}/>
        </Space>
        )
        }
        if(records.Type==='已入住'){
          return(
          <Space size='middle' className='inputButton'>
            <Input type="button" size='small'  bordered={false} value={'退房'} onClick={(e)=>{changestate(e,records.ID);}}/>

          </Space>
          )
          }
        if(records.Type==='打扫中'){
          return(
          <Space size='middle' className='inputButton'>
            <Input type="button" size='small'  bordered={false} value={'打扫完毕'} onClick={(e)=>{changestate(e,records.ID);}}/>
          </Space>
          )
        }
        if(records.Type==='废弃中'){
          return(
          <Space size='middle' className='inputButton'>
            <Input type="button" size='small' bordered={false} value={'启用'} onClick={(e)=>{changestate(e,records.ID);}}/>
          </Space>
          )
        }
      }
    
    }
]
  const items=[
    getitems('room','1',<BankOutlined />),
  ];
  const [current, setCurrent] = useState('1');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  const [data,setData]=useState([]);
  const [searchName,setSearchName]=useState();
  const [searchType,setSearchType]=useState();
  const [open,setOpen] =useState(false);
  const [formVlaue,setFormValue] = useState();
  const [actionValue,setActionValue]=useState('0');
  const [rid,setRid]=useState();
  // const [flag,setFlag]=useState(false);
  /**Action change */
  const changestate=(e,rrid)=>{
    //console.log(e)
    // setFlag(true);
   // console.log(e.target.value)
   // console.log(rrid)
    setRid(rrid)
      if(e.target.value==='入住'){
        setActionValue('1')
      }
      else if(e.target.value==='打扫'){
        setActionValue('2')
      }
      else if(e.target.value==='退房'){
        setActionValue('0')
      }
      else if(e.target.value==='弃用'){
        setActionValue('-1')
      }
      else if(e.target.value==='启用'){
        setActionValue('0')
      }
      else if(e.target.value==='打扫完毕'){
        setActionValue('0')
      }
      else setActionValue('0')
      // console.log(actionValue)
      // console.log(rid)
    //   axios.patch(`http://121.42.165.52/hotelapi/rooms`,{id:rid,type:actionValue}
    //   ).then(function(res){
    //   console.log(res);
    // }).catch(function(error){
    //   console.log(error)
    // })
    
  }


  const showModal = () => {
    setOpen(true);
  };
  /*form submit */
  const handleOk = () => {
    console.log(formVlaue)
    axios.post(`http://121.42.165.52/hotelapi/rooms`,{
      name:formVlaue,
      type:'0'
    }).then((msg)=>{
      console.log(msg)
      if(msg.data.Code===1104){
        message.open({
          type:'warning',
          content:'room name already exists'
        })
      }
      else{
        message.open({
          type:'success',
          content:'add room successfully'
        })
        setOpen(false);
      }
    }).catch(function(error){
      console.log(error)
    })
    
  };
  const handleCancel = () => {
    //console.log('Clicked cancel button');
    setOpen(false);
  };

      /**refresh */
      useEffect(()=>{
        fetchData()
        console.log(actionValue)
        console.log(rid)
        axios.patch(`http://121.42.165.52/hotelapi/rooms`,{id:rid,type:actionValue}
          ).then(function(res){
          console.log(res);
        }).catch(function(error){
          console.log(error)
        })
        fetchData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[actionValue])

      useEffect(()=>{
        fetchData()
        console.log(actionValue)
        console.log(rid)
        axios.patch(`http://121.42.165.52/hotelapi/rooms`,{id:rid,type:actionValue}
          ).then(function(res){
          console.log(res);
        }).catch(function(error){
          console.log(error)
        })
        fetchData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[rid])

      useEffect(()=>{
        if(data.length===0){
          fetchData()
        }
        else{search()}
        }
        , // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(data)]
        )
  /*getlist */
  const fetchData=()=>{
    axios.get('http://121.42.165.52/hotelapi/rooms/list').then(function(res){
  //  console.log(res);
    for(let i = 0 ;i<res.data.Content.length;i++){
      if(res.data.Content[i].Type===0){
        res.data.Content[i].Type='空闲中'
      }
      if(res.data.Content[i].Type===1){
        res.data.Content[i].Type='已入住'
      }
      if(res.data.Content[i].Type===2){
        res.data.Content[i].Type='打扫中'
      }
      if(res.data.Content[i].Type===-1){
        res.data.Content[i].Type='废弃中'
      }
    }
    setData(res.data.Content);
    // console.log(data)
    }).catch(function(error){
        console.log(error)
    })
  }

  /* Input Changed */
  const selectChange=(value)=>{
    setSearchType(value)
    // console.log(value,searchType)
    }
  
  const inputChange=(e)=>{
    setSearchName(e.target.value)
    //console.log(searchName)
  }

  const formChanged=(e)=>{
    setFormValue(e.target.value)
    console.log(formVlaue)
  }

  /* axios */
  const search=()=>{
   
    if(searchType!==undefined && searchName===undefined){
      axios.get(`http://121.42.165.52/hotelapi/rooms/list?type=${searchType}`)
      .then(
        function(res){
          for(let i = 0 ;i<res.data.Content.length;i++){
            if(res.data.Content[i].Type===0){
              res.data.Content[i].Type='空闲中'
            }
            if(res.data.Content[i].Type===1){
              res.data.Content[i].Type='已入住'
            }
            if(res.data.Content[i].Type===2){
              res.data.Content[i].Type='打扫中'
            }
            if(res.data.Content[i].Type===-1){
              res.data.Content[i].Type='废弃中'
            }
          }
          console.log('1'+searchName,searchType)
          //console.log(res)
          setData(res.data.Content)
        }
      ).catch(function(error){
          console.log(error)
      })
    }
    else if(searchName!==undefined && searchType===undefined){
      axios.get(`http://121.42.165.52/hotelapi/rooms/list?name=${searchName}`)
      .then(
        function(res){
          for(let i = 0 ;i<res.data.Content.length;i++){
            if(res.data.Content[i].Type===0){
              res.data.Content[i].Type='空闲中'
            }
            if(res.data.Content[i].Type===1){
              res.data.Content[i].Type='已入住'
            }
            if(res.data.Content[i].Type===2){
              res.data.Content[i].Type='打扫中'
            }
            if(res.data.Content[i].Type===-1){
              res.data.Content[i].Type='废弃中'
            }
          }
          console.log('2'+searchName,searchType)
          //console.log(res)
          setData(res.data.Content)
        }
      ).catch(function(error){
          console.log(error)
      })
    }
    
    else if(searchName!==undefined && searchType!==undefined) {
      axios.get(`http://121.42.165.52/hotelapi/rooms/list?name=${searchName}&type=${searchType}`)
      .then(
        function(res){
          for(let i = 0 ;i<res.data.Content.length;i++){
            if(res.data.Content[i].Type===0){
              res.data.Content[i].Type='空闲中'
            }
            if(res.data.Content[i].Type===1){
              res.data.Content[i].Type='已入住'
            }
            if(res.data.Content[i].Type===2){
              res.data.Content[i].Type='打扫中'
            }
            if(res.data.Content[i].Type===-1){
              res.data.Content[i].Type='废弃中'
            }
          }
          console.log('3'+searchName,searchType)
          //console.log(res)
          setData(res.data.Content)
        }
      ).catch(function(error){
          console.log(error)
      })
    }
    else if(searchName===undefined && searchType===undefined){
      fetchData();
    }
  }
  
  return (
    <Layout>
      <Sider className='nav'>
        <Sider className='Imgg' >
          <img src='./logo192.png' alt='' style={{height:'64px',width:'64px'}}></img>
        </Sider> 
        <Menu 
        onClick={onClick}
        selectedKeys={[current]}
        items={items}
        theme='dark'
        mode="inline"
        className='Emenu'
        //  style={{width:'200px',height:'100%'}}
        />
      </Sider>
      <Layout >
        <Header style={{background:'white'}}>

        </Header>
        <Content style={{margin:'16px'}}>
          <div style={{height:'660px',
                       padding:'16px',
                       background:'white'}}>
            <div className='top'>
              <span style={{width:'78px'}}>房间名:</span>
              <Input placeholder='请输入房间名' value={searchName} style={{width:'140px'}} 
              onChange={inputChange}></Input>
              <span style={{width:'90px'}}>房间状态:</span>
              <Input.Group compact style={{width:'90px'}}>
              <Select style={{width:'90px'}}
              onChange={selectChange}
                options={[ 
                {value:'0' ,label:'空闲中'},
                {value:'-1',label:'废弃中'},
                {value:'1' ,label:'已入住'},
                {value:'2' ,label:'打扫中'},]}
                
              />
              </Input.Group>
              <Button type='primary' 
              icon={<SearchOutlined />} 
              style={{marginLeft:'8px'}}
              onClick={search}>Search</Button>
              <Button type='primary' className='add' 
              icon={<PlusCircleOutlined />}
              onClick={showModal}>Add</Button>
              <Modal
              title="Add room"
              open={open}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Form  name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 12,
              }}
              >
                <Form.Item
                label="RoomName"
                name="roomname"
                rules={[
                  {
                    required: true,
                    message: 'Please input roomname',
                  },
                ]}
              ><Input value={formVlaue} onChange={formChanged} />
              </Form.Item>
              </Form>
            </Modal>
            </div>
            <div className='main'>
              <Table
              columns={columns}
              dataSource={data}
              rowKey={(record)=>record.ID}
              pagination={{showSizeChanger:false}}
              ></Table>
            </div>
          </div>
        </Content>
        <Footer style={{textAlign:'center'}}>
           Create by sthhasbeenbroken
        </Footer>
      </Layout>
  </Layout>
  );
}

export default App;