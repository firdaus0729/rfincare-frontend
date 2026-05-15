import React, { useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import LegalContentEditor from '../../../components/cms/LegalContentEditor';
import { cmsService } from '../../../services/cmsService';
import { homepageService } from '../../../services/homepageService';
import { prepareLegalHtml } from '../../../utils/legalContent';

const HomepageCmsTab = () => {
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [stories, setStories] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: '', excerpt: '', blogUrl: '', imageUrl: '', category: '', isPublished: true });
  const [videoForm, setVideoForm] = useState({ title: '', description: '', youtubeUrl: '', isPublished: true });
  const [legalSlug, setLegalSlug] = useState('privacy-policy');
  const [legalForm, setLegalForm] = useState({ title: '', bodyHtml: '' });

  const load = async () => {
    const [n, v, s] = await Promise.all([
      cmsService.news.list(),
      cmsService.videos.list(),
      cmsService.stories.list('pending'),
    ]);
    setNews(n); setVideos(v); setStories(s);
  };

  const loadLegal = async (slug) => {
    const page = await homepageService.getLegalPage(slug);
    setLegalForm({ title: page.title, bodyHtml: page.bodyHtml || '' });
    setLegalSlug(slug);
  };

  useEffect(() => { load().catch(console.error); loadLegal('privacy-policy').catch(() => {}); }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {['news', 'videos', 'stories', 'legal'].map((t) => (
          <Button key={t} variant={tab === t ? 'default' : 'outline'} size="sm" onClick={() => setTab(t)}>{t}</Button>
        ))}
      </div>
      {tab === 'news' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 border rounded-lg p-4">
            <h3 className="font-semibold">Add news / blog</h3>
            <Input label="Title" value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} />
            <Input label="Excerpt" value={newsForm.excerpt} onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })} />
            <Input label="Blog URL" value={newsForm.blogUrl} onChange={(e) => setNewsForm({ ...newsForm, blogUrl: e.target.value })} />
            <Input label="Image URL" value={newsForm.imageUrl} onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })} />
            <Button onClick={() => cmsService.news.create(newsForm).then(load)}>Save</Button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-auto">{news.map((item) => (
            <li key={item.id} className="border p-3 rounded flex justify-between"><span>{item.title}</span>
            <Button size="sm" variant="outline" onClick={() => cmsService.news.remove(item.id).then(load)}>Delete</Button></li>
          ))}</ul>
        </div>
      )}
      {tab === 'videos' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 border rounded-lg p-4">
            <h3 className="font-semibold">Add YouTube video</h3>
            <Input label="Title" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />
            <Input label="YouTube URL" value={videoForm.youtubeUrl} onChange={(e) => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })} />
            <Input label="Description" value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} />
            <Button onClick={() => cmsService.videos.create(videoForm).then(load)}>Save</Button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-auto">{videos.map((item) => (
            <li key={item.id} className="border p-3 rounded flex justify-between"><span>{item.title}</span>
            <Button size="sm" variant="outline" onClick={() => cmsService.videos.remove(item.id).then(load)}>Delete</Button></li>
          ))}</ul>
        </div>
      )}
      {tab === 'stories' && (
        <ul className="space-y-3">{stories.map((s) => (
          <li key={s.id} className="border p-4 rounded-lg">
            <p className="font-medium">{s.submitter_name}</p>
            <p className="text-sm mt-2">{s.story_text}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => cmsService.stories.moderate(s.id, { action: 'approve' }).then(load)}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => cmsService.stories.moderate(s.id, { action: 'reject', rejectionReason: 'Not suitable' }).then(load)}>Reject</Button>
            </div>
          </li>
        ))}</ul>
      )}
      {tab === 'legal' && (
        <div className="space-y-4 max-w-3xl">
          <select className="border rounded px-3 py-2" value={legalSlug} onChange={(e) => loadLegal(e.target.value)}>
            {['privacy-policy','terms-of-service','help-center','financial-guides','careers','cookie-policy'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Input label="Title" value={legalForm.title} onChange={(e) => setLegalForm({ ...legalForm, title: e.target.value })} />
          <LegalContentEditor
            label="Page content (paragraphs, headings, lists)"
            value={legalForm.bodyHtml}
            onChange={(bodyHtml) => setLegalForm({ ...legalForm, bodyHtml })}
          />
          <Button
            onClick={() =>
              cmsService.legal.update(legalSlug, {
                title: legalForm.title,
                bodyHtml: prepareLegalHtml(legalForm.bodyHtml),
              }).then(() => loadLegal(legalSlug))
            }
          >
            Save legal page
          </Button>
        </div>
      )}
    </div>
  );
};
export default HomepageCmsTab;
