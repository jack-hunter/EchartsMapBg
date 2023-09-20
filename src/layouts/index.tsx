import { Link } from 'umi';
import styles from './index.less';

export default function Layout(props) {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/Home">Home</Link>
        </li>
        <li>
          <a href="https://juejin.cn/post/7184370811518582840" target='_blank'>掘金</a>
        </li>
        <li>
          <a href="https://github.com/jack-hunter/EchartsMapBg" target='_blank'>Github</a>
        </li>
      </ul>
      <div>
        {props.children}
      </div>
    </div>
  );
}
