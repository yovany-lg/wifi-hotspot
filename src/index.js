const command = require('./commands');
const network = require('./network');
const hostapd = require('./hostapd');
const dnsmasq = require('./dnsmasq');

const configureNetwork = async (asHotspot) => {
  await command('sudo systemctl daemon-reload');
  if (asHotspot) {
    await command('sudo systemctl enable hostapd && sudo systemctl enable dnsmasq');
    console.log('---> Robotois Access Point enabled... Restarting');
  } else {
    await command('sudo systemctl disable hostapd && sudo systemctl disable dnsmasq');
    console.log('---> Robotois connecting to Wifi... Restarting');
  }
  command('sudo shutdown -r now');
};

const startAP = (ssid = 'Robotois', psk = '12345678') => {
  const asHotspot = true;
  network.config(asHotspot);
  dnsmasq.config();
  hostapd.config(ssid, psk);
  setTimeout(() => {
    configureNetwork(asHotspot);
  }, 500);
};

const connectWifi = async (ssid, password) => {
  const asHotspot = false;
  const wifiSettings = await command(`wpa_passphrase ${ssid} ${password}`);
  if (!wifiSettings) {
    console.log(`Unknown wifi: ${ssid}`);
    return;
  }
  network.config(asHotspot);
  network.setWifi(wifiSettings);
  setTimeout(() => {
    configureNetwork(asHotspot);
  }, 500);
};

module.exports = {
  connectWifi,
  startAP,
};
