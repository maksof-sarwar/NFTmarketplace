'use client';
import React, { useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { Input } from './ui/input';
import {
	SupabaseFile,
	deleteCollectionImage,
	uploadCollectionImage,
} from '@/lib/upload-image';

const thumbsContainer: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginTop: 16,
};

const thumb: React.CSSProperties = {
	position: 'relative',
	display: 'inline-flex',
	borderRadius: 2,
	border: '1px solid #eaeaea',
	marginBottom: 8,
	marginRight: 8,
	width: 100,
	height: 100,
	padding: 4,
	boxSizing: 'border-box',
};

const thumbInner: React.CSSProperties = {
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden',
};

const img: React.CSSProperties = {
	display: 'block',
	width: 'auto',
	height: '100%',
};

const deleteButton: React.CSSProperties = {
	position: 'absolute',
	top: 0,
	right: 0,
	padding: 8,
	cursor: 'pointer',
	background: 'rgba(255, 255, 255, 0.8)',
	borderRadius: '0 2px 0 0',
	color: 'red',
	backgroundColor: 'red',
	fontSize: '25px',
};

const errorContainer: React.CSSProperties = {
	color: 'red',
	marginTop: 8,
};

type CustomFile = SupabaseFile & { file: File };
type DragZoneProps = {
	onDrop: (file: CustomFile) => void;
	onRemove?: () => void;
	initialFile?: Array<CustomFile>;
};

export const DragZone = ({
	onDrop,
	onRemove,
	initialFile = [],
}: DragZoneProps): JSX.Element => {
	const [loading, setLoading] = useState(false);
	const [localFiles, setLocalFiles] = useState<Array<CustomFile>>(initialFile);
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async (index: number, path: string) => {
		await deleteCollectionImage(path);
		const updatedFiles = [...localFiles];
		updatedFiles.splice(index, 1);
		setLocalFiles(updatedFiles);
		if (onRemove) {
			onRemove();
		}
	};

	const { getRootProps, getInputProps } = useDropzone({
		multiple: false,
		accept: { image: ['image/*'] },
		onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
			if (fileRejections.length > 0) {
				setError('Only images are allowed!');
			} else {
				setError(null);
				setLoading(true);
				try {
					const file = acceptedFiles[0];
					const { path, url } = await uploadCollectionImage(file);
					const obj = { file, path, url };
					setLocalFiles((prevFiles) => [...prevFiles, obj]);
					onDrop(obj);
				} catch (error: any) {
					setError(error.message);
				} finally {
					setLoading(false);
				}
			}
		},
	});

	return (
		<section>
			<div
				{...getRootProps({ className: 'dropzone' })}
				className="flex cursor-pointer w-auto md:w-[400px] items-center justify-center rounded-md border border-dashed bg-slate-100 p-2 py-5"
			>
				{loading ? (
					<p>Loading...</p>
				) : localFiles.length === 0 ? (
					<div className="flex flex-col">
						<Input {...getInputProps()} />
						<p>Click to select files</p>
						{error && <div style={errorContainer}>{error}</div>}
					</div>
				) : (
					<p>Remove file first.</p>
				)}
			</div>
			<aside style={thumbsContainer}>
				{localFiles.map((file, index) => (
					<div style={thumb} key={index}>
						<div style={thumbInner}>
							<img src={file.url} style={img} alt="file" />
						</div>
						<div
							style={deleteButton}
							onClick={() => handleDelete(index, file.path)}
							aria-label="Delete Image"
							className="icon-[typcn--delete]"
						></div>
					</div>
				))}
			</aside>
		</section>
	);
};
