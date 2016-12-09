### Kodi Skill

#### Turning TV on and OFF

https://github.com/bwssytems/ha-bridge
http://192.168.0.120:3002/

```bash
/usr/local/share/ha-bridge
```

```bash
#starthabridge.sh
nohup java -jar -Dserver.port=3002 /usr/local/share/ha-bridge/ha-bridge-3.5.1.jar > /usr/local/share/ha-bridge/habridge-log.txt 2>&1 &
```