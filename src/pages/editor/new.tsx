import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { Input, Button } from "antd";
import { useState } from "react";
import styles from "./index.module.scss";
import { title } from "process";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const NewEditor = () => {
  const [mdContent, setMdContent] = useState("Hello world!");
  const [title, setTitle] = useState("");

  const onTitleChange = (event) => setTitle(event.target.value);

  const handlePublish = () => {
    console.log(title, "title");
    console.log(mdContent, "mdContent");
  };

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={onTitleChange}
        />
        <Button
          type="primary"
          className={styles.button}
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <MDEditor height={969} value={mdContent} onChange={setMdContent} />
    </div>
  );
};

NewEditor.layout = null;

export default NewEditor;
